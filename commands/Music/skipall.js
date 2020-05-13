const { Command } = require("discord-akairo");

module.exports = class SkipAllCommand extends Command {
  constructor() {
    super("skipall", {
      aliases: ["skip-all"],
      category: "Music",
      description: { content: "Skip all songs in queue" },
      guildOnly: true
    });
  }

  exec(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a channel and try again");

    if (
      typeof message.guild.musicData.songDispatcher == "undefined" ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply("There is no song playing right now!");
    }
    if (!message.guild.musicData.queue)
      return message.util.send("There are no songs in queue");
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0; // clear queue
    return;
  }
};
