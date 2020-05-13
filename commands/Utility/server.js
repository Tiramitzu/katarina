const { Command } = require("discord-akairo");
const Logger = require("../../util/Logger");
const Discord = require("discord.js");
const moment = require("moment");
var verificationLevels = {
  NONE: "**None** (`Unrestricted`)",
  LOW: "**Low** (`Must have a verified email on their Discord account`)",
  MEDIUM:
    "**Medium** (`Must also registered on Discord for longer than 5 minutes`)",
  HIGH:
    "**High** [**(╯°□°）╯︵ ┻━┻**] (`Must also registered on Discord for longer than 10 minutes`)",
  EXTREME:
    "**Extreme** [**┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻**] (`Must have a verified phone on their Discord account`)"
};
var region = {
  brazi: " :flag_br: **| Brazil**",
  "eu-central": ":flag_eu: **| Central Europe**",
  singapore: ":flag_sg: **| Singapore**",
  "us-central": ":flag_us: **| U.S. Central**",
  sydney: ":flag_au: **| Sydney**",
  "us-east": ":flag_us: **| U.S. East**",
  "us-south": ":flag_us: **| U.S. South**",
  "us-west": ":flag_us: **| U.S. West**",
  "eu-west": ":flag_eu: **| Western Europe**",
  singapore: ":flag_sg: **| Singapore**",
  london: ":flag_gb: **| London**",
  japan: ":flag_jp: **| Japan**",
  russia: ":flag_ru: **| Russia**",
  hongkong: ":flag_hk: **| Hong Kong**"
};
var statuss = {
  online: "<a:onlineGif:591630100122959873> | Online",
  idle: "<a:idleGif:591630141961142283> | Idle / Away",
  dnd: "<a:dndGif:591630168636784650> | Do Not Disturb",
  offline: "<a:invisibleGif:591630201709002753> | Invisible / Offline"
};

var explicit = {
  DISABLED: "**Disable** (`Don't scan any media content`)",
  MEMBERS_WITHOUT_ROLES:
    "**Members Without Roles** (`Scan media content from members without a role`)",
  ALL_MEMBERS: "**All Members** (`Scan media content from all members`)"
};

class serverCommand extends Command {
  constructor() {
    super("server", {
      aliases: ["server", "s-info"],
      category: "Utility",
      description: {
        content: "Get server information.",
        usage: "[--roles | --emojis]"
      },
      args: [
        {
          id: "roles",
          match: "flag",
          flag: "--roles"
        },
        {
          id: "emojis",
          match: "flag",
          flag: "--emojis"
        },
        {
          id: "icon",
          match: "flag",
          flag: "--icon"
        },
        {
          id: "join",
          match: "separate"
        }
      ]
    });
  }

  async exec(message, args) {
    let guild = message.guild;

    if (args.roles) {
      let number = guild.roles.cache
        .array()
        .sort()
        .map((x, i) => `\`${i + 1}\` - ${x}`); //.join('\n')
      number = chunk(number, 10);

      let index = 0;
      const ge = this.client.util
        .embed()
        .setColor("#2f3136")
        .setAuthor(
          ` | Roles List [${guild.roles.cache.size}]`,
          this.client.user.displayAvatarURL()
        )
        .setDescription(number[index].join("\n"))
        .setFooter(`Page ${index + 1} of ${number.length}`);
      const m = await message.util.send(ge);
      await m.react("⬅");
      await m.react("🔴");
      await m.react("➡");
      async function awaitReaction() {
        const filter = (rect, usr) =>
          ["⬅", "🔴", "➡"].includes(rect.emoji.name) &&
          usr.id === message.author.id;
        const response = await m.awaitReactions(filter, {
          max: 1,
          time: 30000
        });
        if (!response.size) {
          return undefined;
        }
        const emoji = response.first().emoji.name;
        if (emoji === "⬅") index--;
        if (emoji === "🔴") m.delete();
        if (emoji === "➡") index++;

        index = ((index % number.length) + number.length) % number.length;
        ge.setDescription(number[index].join("\n"));
        ge.setFooter(`Page ${index + 1} of ${number.length}`);
        await m.edit(ge);
        return awaitReaction();
      }
      return awaitReaction();
    }
    function chunk(array, chunkSize) {
      const temp = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
      }
      return temp;
      return;
    }

    if (args.emojis) {
      let number = guild.emojis.cache
        .array()
        .map((x, i) => `${i + 1} - ${x} (${x.id}) (${x.name})`);
      number = chunk(number, 10);

      if (!number)
        return message.util.send("Sorry, this server not have emoji");

      let index = 0;
      const ge = this.client.util
        .embed()
        .setColor("#2f3136")
        .setAuthor(
          `| Server Emote List`,
          guild.iconURL({ format: "png", size: 1024, dynamic: true })
        )
        .addField(`${guild.owner.user.tag}`, `(${guild.ownerID})`)
        .setDescription(number[index].join("\n"))
        .setFooter(`Page ${index + 1} of ${number.length}`);
      const m = await message.util.send(ge);
      await m.react("⬅");
      await m.react("🔴");
      await m.react("➡");
      async function awaitReaction() {
        const filter = (rect, usr) =>
          ["⬅", "🔴", "➡"].includes(rect.emoji.name) &&
          usr.id === message.author.id;
        const response = await m.awaitReactions(filter, {
          max: 1,
          time: 30000
        });
        if (!response.size) {
          return undefined;
        }
        const emoji = response.first().emoji.name;
        if (emoji === "⬅") index--;
        if (emoji === "🔴") m.delete();
        if (emoji === "➡") index++;

        index = ((index % number.length) + number.length) % number.length;
        ge.setDescription(number[index].join("\n"));
        ge.setFooter(`Page ${index + 1} of ${number.length}`);
        await m.edit(ge);
        return awaitReaction();
      }
      return awaitReaction();
    }
    function chunk(array, chunkSize) {
      const temp = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        temp.push(array.slice(i, i + chunkSize));
      }
      return temp;
      return;
    }
    let sicon = guild.iconURL({ format: "png", size: 1024, dynamic: true });
    let serverembed = this.client.util.embed();
    serverembed.setAuthor(guild.name, sicon);
    serverembed.setColor("#2f3136");
    serverembed.setDescription(`**Guild Description:**
${guild.description ? guild.description : "Nay"}`);
    serverembed.setThumbnail(sicon, true);
    serverembed.addField(":credit_card: | ID", guild.id, true);
    serverembed.addField(
      ":earth_americas: | Server Region",
      `${region[guild.region]}`,
      true
    );
    serverembed.addField(
      ":bust_in_silhouette: | Ownership",
      `${guild.owner.user.tag} (${guild.ownerID})`,
      true
    );
    serverembed.addField(
      ":busts_in_silhouette: | Members",
      guild.memberCount,
      true
    );
    serverembed.addField(
      ":busts_in_silhouette: | Member Status",
      `<a:onlineGif:591630100122959873> | Online: **${
        guild.members.cache.filter(x => x.presence.status === "online").size
      }** \n<a:idleGif:591630141961142283> | Idle: **${
        guild.members.cache.filter(x => x.presence.status === "idle").size
      }** \n<a:dndGif:591630168636784650> | DND: **${
        guild.members.cache.filter(x => x.presence.status === "dnd").size
      }** \n<a:invisibleGif:591630201709002753> | Offline: **${
        guild.members.cache.filter(x => x.presence.status === "offline").size
      }**`,
      true
    );
    serverembed.addField(
      ":clock9: | Created At",
      moment.utc(guild.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
      true
    );
    serverembed.addField(
      `:satellite: | Channels [${guild.channels.cache.size}]`,
      `- **${
        guild.channels.cache.filter(m => m.type === "category").size
      }** Category \n- **${
        guild.channels.cache.filter(m => m.type === "text").size
      }** Text \n- **${
        guild.channels.cache.filter(m => m.type === "voice").size
      }** Voice\n- **${
        guild.channels.cache.filter(m => m.type === "news").size
      }** News\n- **${
        guild.channels.cache.filter(m => m.type === "store").size
      }** Store`,
      true
    );
    serverembed.addField(
      `:frame_photo: | Explicit Content Filter`,
      explicit[guild.explicitContentFilter],
      true
    );
    serverembed.addField(
      ":shield: | Verification Level",
      `${verificationLevels[guild.verificationLevel]}`,
      true
    );
    serverembed.addField(
      `🔒 | Roles [${guild.roles.cache.size}]`,
      `To see list of all roles\nuse **k!server --roles**`,
      true
    );
    serverembed.addField(
      `:mag_right: | Emojis [${guild.emojis.cache.size}]`,
      `To see list of all emojis\nuse **k!server --emojis**`,
      true
    );
    serverembed.addField("\u200b", "\u200b", true);
    serverembed.addField(
      `<:nitroBoost:676037315692331009> | Premium Tier:`,
      `\`${guild.premiumTier}\``,
      true
    );
    serverembed.addField(
      `<:nitroBoost:676037315692331009> | Premium Subscription:`,
      `\`${guild.premiumSubscriptionCount}\``,
      true
    );
    serverembed.setFooter(`Requested By: ${message.author.tag}`);
    serverembed.setTimestamp();

    message.util.send(serverembed);
  }
}

module.exports = serverCommand;
