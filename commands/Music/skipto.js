const { Command } = require("discord-akairo");

module.exports = class SkipToCommand extends Command {
  constructor() {
    super("skipto", {
      aliases: ["skipto"],
      category: "Music",
      description: {
        content:
          "Skip to a specific song in the queue, provide the song number as an argument"
      },
      guildOnly: true,
      args: [
        {
          id: "songNumber",
          prompt: {
            start: (msg, text) =>
              `What is the number in queue of the song you want to skip to?, it needs to be greater than 1`
          },
          type: "integer"
        }
      ]
    });
  }

  exec(message, { songNumber }) {
    if (songNumber < 1 && songNumber >= message.guild.musicData.queue.length) {
      return message.reply("Please enter a valid song number");
    }
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a channel and try again");

    if (
      typeof message.guild.musicData.songDispatcher == "undefined" ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply("There is no song playing right now!");
    }

    if (message.guild.musicData.queue < 1)
      return message.util.send("There are no songs in queue");

    message.guild.musicData.queue.splice(0, songNumber - 1);
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
