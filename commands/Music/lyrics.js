const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-superfetch");
const cheerio = require("cheerio");
const { geniusLyricsAPI } = process.env;

class LyricsCommand extends Command {
  constructor() {
    super("lyrics", {
      aliases: ["lyrics"],
      description: {
        content:
          "Get lyrics of any song or the lyrics of the currently playing song"
      },
      category: "Music",
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          id: "songName",
          default: "",
          type: "string",
          prompt: {
            start: (msg, text) =>
              `What song lyrics would you like to get?`
          }
        }
      ]
    });
  }
  async exec(message, { songName }) {
    if (
      songName == "" &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
    ) {
      songName = message.guild.musicData.nowPlaying.title;
    } else if (songName == "" && message.guild.triviaData.isTriviaRunning) {
      return message.util.send("Please try again after the trivia has ended");
    } else if (songName == "" && !message.guild.musicData.isPlaying) {
      return message.util.send(
        "There is no song playing right now, please try again with a song name or play a song first"
      );
    }
    const sentMessage = await message.channel.send(
      "👀 Searching for lyrics 👀"
    );

    // get song id
    var url = `https://api.genius.com/search?q=${encodeURI(songName)}`;

    const headers = {
      Authorization: `Bearer ${geniusLyricsAPI}`
    };
    try {
      var body = await fetch(url, { headers });
      var result = await body.json();
      const songID = result.response.hits[0].result.id;

      // get lyrics
      url = `https://api.genius.com/songs/${songID}`;
      body = await fetch(url, { headers });
      result = await body.json();

      const song = result.response.song;

      let lyrics = await getLyrics(song.url);
      lyrics = lyrics.replace(/(\[.+\])/g, "");

      if (lyrics.length > 4095)
        return message.util.send("Lyrics are too long to be returned as embed");
      if (lyrics.length < 2048) {
        const lyricsEmbed = this.client.util
          .embed()
          .setColor("#00724E")
          .setDescription(lyrics.trim());
        return sentMessage.edit("", lyricsEmbed);
      } else {
        // lyrics.length > 2048
        const firstLyricsEmbed = this.client.util
          .embed()
          .setColor("#00724E")
          .setDescription(lyrics.slice(0, 2048));
        const secondLyricsEmbed = this.client.util
          .embed()
          .setColor("#00724E")
          .setDescription(lyrics.slice(2048, lyrics.length));
        sentMessage.edit("", firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      }
    } catch (e) {
      console.error(e);
      return sentMessage.edit(
        "Something when wrong, please try again or be more specific"
      );
    }
    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $(".lyrics")
        .text()
        .trim();
    }
  }
}

module.exports = LyricsCommand;
