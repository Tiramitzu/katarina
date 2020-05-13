const { Command } = require("discord-akairo");

class ResumeCommand extends Command {
  constructor() {
    super("resume", {
      aliases: ["resume", "resume-song", "continue"],
      category: "Music",
      description: { content: "Resume the current paused song" },
      guildOnly: true
    });
  }

  exec(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a channel and try again");

    if (
      typeof message.guild.musicData.songDispatcher == "undefined" ||
      message.guild.musicData.songDispatcher === null
    ) {
      return message.reply("There is no song playing right now!");
    }

    message.channel.send("Song resumed :play_pause:");

    message.guild.musicData.songDispatcher.resume();
  }
}

module.exports = ResumeCommand;
