const { Command } = require("discord-akairo");

class LoopCommand extends Command {
  constructor() {
    super("loop", {
      aliases: ["loop"],
      category: "Music",
      guildOnly: true,
      description: { content: "Loop the current playing song" },
      *args() {
        const numOfTimesToLoop = yield {
          id: "numOfTimesToLoop",
          default: 1,
          type: "integer",
          prompt: {
            start: (msg, text) =>
              `How many times do you want to loop the song?`
          }
        };
        return { numOfTimesToLoop };
      }
    });
  }

  exec(message, { numOfTimesToLoop }) {
    if (!message.guild.musicData.isPlaying) {
      return message.channel.send("There is no song playing right now!");
    } else if (
      message.guild.musicData.isPlaying &&
      message.guild.triviaData.isTriviaRunning
    ) {
      return message.channel.send("You cannot loop over a trivia!");
    }

    for (let i = 0; i < numOfTimesToLoop; i++) {
      message.guild.musicData.queue.unshift(message.guild.musicData.nowPlaying);
    }

    // prettier-ignore
    message.channel.send(
      `${message.guild.musicData.nowPlaying.title} looped ${numOfTimesToLoop} ${
        (numOfTimesToLoop == 1) ? 'time' : 'times'
      }`
    );
  }
}

module.exports = LoopCommand;
