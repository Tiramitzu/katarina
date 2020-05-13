const { Command } = require("discord-akairo");
const Discord = require("discord.js");
let footer = "Requested By:";
let color = "#2f3136";

class avatarCommand extends Command {
  constructor() {
    super("avatar", {
      aliases: ["avatar", "ava"],
      category: "Utility",
      description: {
        content: "Get avatar server or user.",
        usage: "[--server/guild | userid | @mention | username | username#0000]"
      },
      args: [
        {
          id: "server",
          match: "flag",
          flag: "--server"
        },
        {
          id: "guild",
          match: "flag",
          flag: "--guild"
        },
        {
          id: "opt1",
          match: "content"
        }
      ]
    });
  }
  async exec(message, args) {
    let arg = args.opt1;
    if (!arg) arg = message.author.username;
    let role = new RegExp(arg, "gi");
    let pepel = this.client.users.cache
      .array()
      .find(r => r.username.match(role));
    let pepel1 = this.client.users.cache.array().find(r => r.tag.match(role));

    if (args.server || args.guild) {
      let sicon = message.guild.iconURL({
        format: "png",
        size: 1024,
        dynamic: true
      });
      let embed = this.client.util
        .embed()
        .setTitle(`${message.guild.name}'s' Icon`)
        .setURL(`${sicon}`)
        .setImage(
          message.guild.iconURL({ format: "png", size: 2048, dynamic: true })
        )
        .setColor(color)
        .setFooter(`${footer} ${message.author.tag}`)
        .setTimestamp();
      return message.util
        .send("***Generating guild icon...***")
        .then(async msg => {
          setTimeout(() => {
            msg.delete();
          }, 1500);
          setTimeout(() => {
            msg.channel.send(embed);
          }, 1500);
        });
      return;
    }

    let user =
      pepel ||
      pepel1 ||
      message.mentions.users.first() ||
      this.client.users.cache.get(args.opt1);
    if (!user) user = message.author;

    let embed = this.client.util
      .embed()
      .setTitle(`${user.username}'s Avatar`)
      .setURL(
        user.avatarURL({
          format: "png",
          size: 1024,
          dynamic: true
        })
      )
      .setImage(
        user.displayAvatarURL({ format: "png", size: 2048, dynamic: true })
      )
      .setColor(color)
      .setFooter(`${footer} ${message.author.tag}`)
      .setTimestamp();
    return message.util.send("***Generating avatar...***").then(async msg => {
      setTimeout(() => {
        msg.delete();
      }, 1500);
      setTimeout(() => {
        msg.channel.send(embed);
      }, 1500);
    });
  }
}

module.exports = avatarCommand;
