const { Command } = require("discord-akairo");

class ShuffleQueueCommand extends Command {
  constructor() {
    super("shuffle", {
      aliases: ["shuffle"],
      category: "Nusic",
      description: { content: "Shuffle the song queue" },
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

    if (message.guild.musicData.queue.length < 1)
      return message.util.send("There are no songs in queue");

    shuffleQueue(message.guild.musicData.queue);

    const titleArray = [];
    message.guild.musicData.queue.map(obj => {
      titleArray.push(obj.title);
    });
    var queueEmbed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setTitle("New Music Queue");
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
    }
    return message.util.send(queueEmbed);
  }
}

function shuffleQueue(queue) {
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
}

module.exports = ShuffleQueueCommand;
