const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require("fs");
const prefix = process.env.prefix;

module.exports = class MusicTriviaCommand extends Command {
  constructor() {
    super("music-trivia", {
      aliases: ["music-trivia", "music-quiz", "start-quiz"],
      category: "Music",
      description: { content: "Engage in a music quiz with your friends!" },
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          id: "numberOfSongs",
          prompt: {
            start: (msg, text) =>
              `What is the number of songs you want the quiz to have?`
          },
          type: "integer",
          default: 5,
          max: 15
        }
      ]
    });
  }
  async exec(message, { numberOfSongs }) {
    // check if user is in a voice channel
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.util.send("Please join a voice channel and try again");
    if (message.guild.musicData.isPlaying === true)
      return message.channel.send("A quiz or a song is already running");
    message.guild.musicData.isPlaying = true;
    message.guild.triviaData.isTriviaRunning = true;
    // fetch link array from txt file
    const jsonSongs = fs.readFileSync("musictrivia.json", "utf8");
    var videoDataArray = JSON.parse(jsonSongs).songs;
    // get random numberOfSongs videos from array
    const randomXVideoLinks = MusicTriviaCommand.getRandom(
      videoDataArray,
      numberOfSongs
    ); // get x random urls
    // create and send info embed
    const infoEmbed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setTitle("Starting Music Quiz")
      .setDescription(
        `Get ready! There are ${numberOfSongs} songs, you have 60 seconds to guess either the artist/band or the name of the song. Good luck!
        You can end the trivia at any point by using the end-trivia command`
      );
    message.util.send(infoEmbed);
    // init quiz queue
    // turn each vid to song object

    for (let i = 0; i < randomXVideoLinks.length; i++) {
      const song = {
        url: randomXVideoLinks[i].url,
        artist: randomXVideoLinks[i].artist,
        title: randomXVideoLinks[i].title,
        voiceChannel
      };
      message.guild.triviaData.triviaQueue.push(song);
    }
    const channelInfo = Array.from(
      message.member.voice.channel.members.entries()
    );
    channelInfo.forEach(user => {
      if (user[1].user.bot) return;
      message.guild.triviaData.triviaScore.set(user[1].user.username, 0);
    });
    MusicTriviaCommand.playQuizSong(
      message.guild.triviaData.triviaQueue,
      message
    );
  }

  static async playQuizSong(queue, message) {
    var classThis = this;
    queue[0].voiceChannel.join().then(function(connection) {
      const dispatcher = connection
        .play(
          ytdl(queue[0].url, {
            quality: "highestaudio",
            highWaterMark: 1024 * 1024 * 1024
          })
        )
        .on("start", function() {
          message.guild.musicData.songDispatcher = dispatcher;
          dispatcher.setVolume(message.guild.musicData.volume);
          let songNameFound = false;
          let songArtistFound = false;

          const filter = msg =>
            message.guild.triviaData.triviaScore.has(msg.author.username) && !message.guild.triviaData.userGuessed.has(msg.author.username);
          const collector = message.channel.createMessageCollector(filter, {
            time: 60000
          });

          collector.on("collect", msg => {
            if (!message.guild.triviaData.triviaScore.has(msg.author.username) || message.guild.triviaData.userGuessed.has(msg.author.username))
              return;
            if (msg.content.startsWith(prefix)) return;
            // if user guessed song name
            if (msg.content.toLowerCase() === queue[0].title.toLowerCase()) {
              if (songNameFound) return; // if song name already found
              songNameFound = true;

              if (songNameFound && songArtistFound) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react("591629527571234819");
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  1
              );
              msg.react("591629527571234819");
            }
            // if user guessed artist
            else if (
              msg.content.toLowerCase() === queue[0].artist.toLowerCase()
            ) {
              if (songArtistFound) return;
              songArtistFound = true;
              if (songNameFound && songArtistFound) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react("591629527571234819");
                return collector.stop();
              }

              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  1
              );
              msg.react("591629527571234819");
            } else if (
              msg.content.toLowerCase() ===
                queue[0].artist.toLowerCase() +
                  " " +
                  queue[0].title.toLowerCase() ||
              msg.content.toLowerCase() ===
                queue[0].title.toLowerCase() +
                  " " +
                  queue[0].artist.toLowerCase()
            ) {
              if (
                (songArtistFound && !songNameFound) ||
                (songNameFound && !songArtistFound)
              ) {
                message.guild.triviaData.triviaScore.set(
                  msg.author.username,
                  message.guild.triviaData.triviaScore.get(
                    msg.author.username
                  ) + 1
                );
                msg.react("591629527571234819");
                return collector.stop();
              }
              message.guild.triviaData.triviaScore.set(
                msg.author.username,
                message.guild.triviaData.triviaScore.get(msg.author.username) +
                  2
              );
              msg.react("591629527571234819");
              return collector.stop();
            } else {
              // wrong answer
              return msg.react("591629546193813505");
            }
          });

          collector.on("end", function() {
            /*
            The reason for this if statement is that we don't want to get an
            empty embed returned via chat by the bot if end-trivia command was called
            */
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.triviaData.wasTriviaEndCalled = false;
              return;
            }

            const sortedScoreMap = new Map(
              [...message.guild.triviaData.triviaScore.entries()].sort(function(
                a,
                b
              ) {
                return b[1] - a[1];
              })
            );

            const song = `${classThis.capitalize_Words(
              queue[0].artist
            )}: ${classThis.capitalize_Words(queue[0].title)}`;

            const embed = new MessageEmbed()
              .setColor("#2f3136")
              .setTitle(`The song was:  ${song}`)
              .setDescription(
                classThis.getLeaderBoard(Array.from(sortedScoreMap.entries()))
              );

            message.channel.send(embed);
            queue.shift();
            dispatcher.end();
            return;
          });
        })
        .on("finish", function() {
          if (queue.length >= 1) {
            return classThis.playQuizSong(queue, message);
          } else {
            if (message.guild.triviaData.wasTriviaEndCalled) {
              message.guild.musicData.isPlaying = false;
              message.guild.triviaData.isTriviaRunning = false;
              message.guild.musicData.songDispatcher = null;
              message.guild.me.voice.channel.leave();
              return;
            }
            const sortedScoreMap = new Map(
              [...message.guild.triviaData.triviaScore.entries()].sort(function(
                a,
                b
              ) {
                return b[1] - a[1];
              })
            );
            const embed = new MessageEmbed()
              .setColor("#2f3136")
              .setTitle(`Music Quiz Results:`)
              .setDescription(
                classThis.getLeaderBoard(Array.from(sortedScoreMap.entries()))
              );
            message.channel.send(embed);
            message.guild.musicData.isPlaying = false;
            message.guild.triviaData.isTriviaRunning = false;
            message.guild.triviaData.triviaScore.clear();
            message.guild.musicData.songDispatcher = null;
            message.guild.me.voice.channel.leave();
            return;
          }
        });
    });
  }

  static getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      // prettier-ignore
      result[n] = arr[(x in taken) ? taken[x] : x];
      // prettier-ignore
      taken[x] = (--len in taken) ? taken[len] : len;
      // prettier-ignore-end
    }
    return result;
  }

  static getLeaderBoard(arr) {
    if (!arr) return;
    let leaderBoard = "";

    leaderBoard = `👑   **${arr[0][0]}:** ${arr[0][1]}  points`;

    if (arr.length > 1) {
      for (let i = 1; i < arr.length; i++) {
        leaderBoard =
          leaderBoard + `\n\n   ${i + 1}: ${arr[i][0]}: ${arr[i][1]}  points`;
      }
    }
    return leaderBoard;
  }
  // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
  static capitalize_Words(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
};
