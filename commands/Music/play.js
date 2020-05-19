const { Command } = require('discord-akairo');

class PauseCommand extends Command {
  constructor() {
    super("pause", {
      aliases: ['pause', 'pause-song', 'hold', 'stop'],
      category: 'music',
      description: { content: 'Pause the current playing song'},
      guildOnly: true
    });
  }

  exec(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.util.send('There is no song playing right now!');
    }

    message.util.send('Song paused :pause_button:');

    message.guild.musicData.songDispatcher.pause();
  }
};

module.exports = PauseCommand;
