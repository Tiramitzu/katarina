const { Command } = require("discord-akairo");

class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue", "song-list", "next-songs"],
      category: "Music",
      guildOnly: true,
      description: { content: "Display the song queue" }
    });
  }

  exec(message) {
    if (message.guild.triviaData.isTriviaRunning)
      return message.util.send("Try again after the trivia has ended");
    if (message.guild.musicData.queue.length == 0)
      return message.util.send("There are no songs in queue!");
    const authorArray = [];
    const titleArray = [];
    /* eslint-disable */
    message.guild.musicData.queue.map(obj => {
      authorArray.push(obj.author.tag);
    });
    message.guild.musicData.queue.map(obj => {
      titleArray.push(obj.title);
    });
    /* eslint-enable */
    var queueEmbed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setThumbnail(this.client.user.displayAvatarURL())
      .setTimestamp()
      .setAuthor(message.guild.name+" Music Queue", message.guild.iconURL());
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.setDescription(
        `${message.guild.musicData.queue
          .map(
            song =>
              `**-** ` +
              song.title +
              ` 
Requested By: **${song.author.tag}**`
          )
          .join(`\n`)}`
      );
    }
    return message.util.send(queueEmbed);
  }
}

module.exports = QueueCommand;
