const { Command } = require("discord-akairo");

module.exports = class VolumeCommand extends Command {
  constructor() {
    super("volume", {
      aliases: ["volume", "change-volume"],
      group: "music",
      guildOnly: true,
      description: { content: "Adjust song volume" },
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          id: "wantedVolume",
          prompt: {
            start: (msg, text) =>
              `What volume would you like to set? from 1 to 200`
          },
          type: "integer",
          validate: function(wantedVolume) {
            return wantedVolume >= 1 && wantedVolume <= 200;
          }
        }
      ]
    });
  }

  exec(message, { wantedVolume }) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Join a channel and try again");

    if (
      typeof message.guild.musicData.songDispatcher == "undefined" ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply("There is no song playing right now!");
    }
    const volume = wantedVolume / 100;
    message.guild.musicData.volume = volume;
    message.guild.musicData.songDispatcher.setVolume(volume);
    message.say(`Current volume is: ${wantedVolume}%`);
  }
};
