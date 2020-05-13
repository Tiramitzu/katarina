const Akairo = require("discord-akairo");
const { Command } = Akairo;
const Discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");
const v = "1.0.2";

class StatsCommand extends Command {
  constructor() {
    super("stats", {
      aliases: ["stats", "st", "stat"],
      category: "Core",
      description: { content: "Displays Katarina's statistics." }
    });
  }

  formatMilliseconds(ms) {
    let x = Math.floor(ms / 1000);
    let seconds = x % 60;

    x = Math.floor(x / 60);
    let minutes = x % 60;

    x = Math.floor(x / 60);
    let hours = x % 24;

    let days = Math.floor(x / 24);

    seconds = `${"0".repeat(2 - seconds.toString().length)}${seconds}`;
    minutes = `${"0".repeat(2 - minutes.toString().length)}${minutes}`;
    hours = `${"0".repeat(2 - hours.toString().length)}${hours}`;
    days = `${"0".repeat(Math.max(0, 2 - days.toString().length))}${days}`;

    return `${days === "00" ? "" : `${days}:`}${hours}:${minutes}:${seconds}`;
  }

  async exec(message) {
    let start = Date.now();
    let diff = Date.now() - message.createdTimestamp;
    let API = this.client.ws.ping.toFixed(2);

    let botGuilds = this.client.guilds.cache.size;
    let botChannels = this.client.guilds.cache
      .reduce((c, d) => c + d.channels.cache.size, 0)
      .toLocaleString();
    let botUsers = this.client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString();

    const embed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setThumbnail(
        this.client.user.displayAvatarURL({
          format: "png",
          size: 1024,
          dynamic: true
        })
      )
      .setTitle("My current statistics")
      .setDescription(
        `**General Statistic**
\`\`\`asciidoc
Uptime         :: ${this.formatMilliseconds(this.client.uptime)} 
Users          :: ${botUsers}
Channels       :: ${botChannels}
Servers        :: ${botGuilds}\`\`\`
**System Statistic**
        \`\`\`asciidoc
Akairo         :: v${Akairo.version}
Discord.js     :: v${Discord.version}
Node           :: ${process.version}
Version Bot    :: v${v}
CPU            :: ${os.cpus().map(i => `${i.model}`)[0]} X3
Arch           :: ${os.arch()}
Platform       :: ${os.platform()}
Memory Usage   :: ${Math.round(
          process.memoryUsage().heapUsed / 1024 / 1024
        )} MB\`\`\`
**📌 Developer**
• @${this.client.users.cache.get("397322976552550400").tag}

**📌 Partners** 
• None`
      )
      .setFooter("Latency: " + diff + " | API: " + API);
    message.channel.send(embed);
  }
}

module.exports = StatsCommand;
