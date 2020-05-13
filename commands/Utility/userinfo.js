const { Command } = require("discord-akairo");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const footer = "Requested By:";

class userInfoCommand extends Command {
  constructor() {
    super("uinfo", {
      aliases: ["user-info", "u-info"],
      category: "Utility",
      description: {
        content: "Get server information.",
        usage: "[userid | @mention | username | username#0000]"
      },
      args: [
        {
          id: "user",
          match: "content"
        }
      ]
    });
  }
  async exec(message, args) {
    var statuss = {
      online: "<a:onlineGif:591630100122959873> | Online",
      idle: "<a:idleGif:591630141961142283> | Idle / Away",
      dnd: "<a:dndGif:591630168636784650> | Do Not Disturb",
      offline: "<a:invisibleGif:591630201709002753> | Invisible / Offline"
    };
    var statusss = {
      online: "<a:onlineGif:591630100122959873>",
      idle: "<a:idleGif:591630141961142283>",
      dnd: "<a:dndGif:591630168636784650>",
      offline: "<a:invisibleGif:591630201709002753>"
    };
    let arg = args.user;
    if (!arg) arg = message.author.username;
    let role = new RegExp(arg, "gi");
    let pepel = message.guild.members.cache
      .array()
      .find(r => r.user.username.match(role));
    let pepel1 = message.guild.members.cache
      .array()
      .find(r => r.user.tag.match(role));

    let user =
      pepel ||
      pepel1 ||
      message.mentions.members.id ||
      message.guild.members.cache.get(args.user);
    if (!user) user = message.author;

    let fuckingemoji = "";
    let fuckingname = "";
    let fuckingname1 = "";
    if (user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0]) {
      if (
        user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0]
          .emoji == null
      )
        fuckingemoji = "";
      if (
        user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0]
          .emoji !== null
      )
        fuckingemoji = user.presence.activities.filter(
          x => x.type == "CUSTOM_STATUS"
        )[0].emoji.name;
    }
    if (!user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0])
      fuckingemoji = "";
    if (user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0])
      fuckingname = user.presence.activities.filter(
        x => x.type == "CUSTOM_STATUS"
      )[0].state;
    if (!user.presence.activities.filter(x => x.type == "CUSTOM_STATUS")[0])
      fuckingname = "NONE";

    if (user.presence.activities.filter(x => x.type !== "CUSTOM_STATUS")[0])
      fuckingname1 = user.presence.activities.filter(
        x => x.type !== "CUSTOM_STATUS"
      )[0].name;
    if (!user.presence.activities.filter(x => x.type !== "CUSTOM_STATUS")[0])
      fuckingname1 = "NONE";

    let ui = this.client.util
      .embed()
      .setAuthor(
        user.user.tag + " Information",
        user.user.displayAvatarURL({ format: "png", size: 2048, dynamic: true })
      )
      .setThumbnail(
        user.user.displayAvatarURL({ format: "png", size: 2048, dynamic: true })
      )
      .addField(":id: | User ID", user.user.id, true)
      .setColor("#2f3136")
      .addField(":credit_card: | Username", user.user.username, true)
      .addField(":label: | Tag", user.user.tag, false)
      .addField(
        `${statusss[user.presence.status]} | Status`,
        statuss[user.presence.status],
        true
      )
      .addField(":video_game: | Game", fuckingname1, true)
      .addField(":pencil: | Custom Status", `${fuckingemoji} ${fuckingname}`)
      .addField("🔏 | Roles", user.roles.cache.map(x => x.name).join(", "))
      .addField(
        "<a:blobJoin:595662033417142272> | Joined At",
        moment.utc(user.joinedTimestamp).format("ddd, MMM Do YYYY, HH:mm:ss"),
        true
      )
      .addField(
        ":calendar: | Created At",
        moment.utc(user.createdAt).format("ddd, MMM Do YYYY, HH:mm:ss"),
        true
      )
      .setFooter(`${footer} ${message.author.tag}`)
      .setTimestamp();

    message.util.send(ui);
  }
}

module.exports = userInfoCommand;
