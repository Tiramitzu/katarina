const { Command } = require("discord-akairo");

module.exports = class SkipCommand extends Command {
  constructor() {
    super("skip", {
      aliases: ["skip", "skip-song", "advance-song"],
      category: "Music",
      description: { content: "Skip the current playing song" },
      guildOnly: true
    });
  }

  exec(message) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a channel and try again");

    if (
      typeof message.guild.musicData.songDispatcher == "undefined" ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply("There is no song playing right now!");
    } else if (message.guild.triviaData.isTriviaRunning) {
      return message.reply(`You can't skip a trivia! Use end-trivia`);
    }
    message.guild.musicData.songDispatcher.end();
  }
};
