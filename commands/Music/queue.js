const { Command } = require('discord-akairo');

class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue", 'song-list', 'next-songs'],
      category: 'Music',
      guildOnly: true,
      description: {content: 'Display the song queue'}
    });
  }

  exec(message) {
    if (message.guild.triviaData.isTriviaRunning)
      return message.util.send('Try again after the trivia has ended');
    if (message.guild.musicData.queue.length == 0)
      return message.util.send('There are no songs in queue!');
    const titleArray = [];
    /* eslint-disable */
    message.guild.musicData.queue.map(obj => {
      titleArray.push(obj.title);
    });
    /* eslint-enable */
    var queueEmbed = this.client.util.embed()
      .setColor('#2f3136')
      .setTitle('Music Queue');
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.util.send(queueEmbed);
  }
};

module.exports = QueueCommand;