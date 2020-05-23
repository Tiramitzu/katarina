const { Command } = require('discord-akairo');

class LeaveCommand extends Command {
  constructor() {
    super("leave", {
      aliases: ["leave", 'end'],
      category: 'Music',
      guildOnly: true,
      description: {content: 'Leaves voice channel if in one' }
    });
  }

  exec(message) {
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if (
      typeof message.guild.musicData.songDispatcher == 'undefined' ||
      message.guild.musicData.songDispatcher == null
    ) {
      return message.reply('There is no song playing right now!');
    }
    if (!message.guild.musicData.queue)
      return message.util.send('There are no songs in queue');
    message.guild.musicData.songDispatcher.end();
    message.guild.musicData.queue.length = 0;
    return;
  }
};

module.exports = LeaveCommand;