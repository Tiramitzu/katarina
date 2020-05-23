const { Canvas } = require("canvas-constructor");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { get } = require("node-superfetch");
const { loadImage } = require("canvas");
const { Command } = require("discord-akairo");
const ig = require("user-instagram");

module.exports = class CanvasCommand extends Command {
  constructor() {
    super("canvas", {
      aliases: ["canvas", "cv"],
      category: "Developer",
      ownerOnly: true,
      quoted: false,
      description: {
        content: "Evaluates code.",
        usage: "<code>"
      }
    });
  }
  *args() {
    const code = yield {
      match: "text"
    };

    return { code };
  }

  async exec(message, { code }) {
    const { body: plate } = await get("https://i.imgur.com/f8SpAXm.png");

    const { body: avatar } = await get(
      `${message.author.avatarURL({
        format: "png",
        size: 1024,
        dynamic: true
      })}`
    );
    
    let def = await this.client.snek.get("https://www.instagram.com/zealcord/?__a=1 ").then(x => x.body.graphql.user)
    
    const { body: background } = await get(
      "https://cdn.discordapp.com/attachments/691120588445450283/706425029256151090/p.png"
    );
    const { body: frontground } = await get(
      "https://cdn.discordapp.com/attachments/691120588445450283/706422297480921160/Profile.png"
    );
    
    let ava = await this.client.snek.get("https://www.instagram.com/zealcord/?__a=1").then(x => x.body.graphql.user.profile_pic_url_hd)
    
    let a = await ig("tiramitzu")
    
    const name =
      message.author.tag.length > 25
        ? message.author.tag.substring(0, 22) + "..."
        : message.author.tag;
    
    const ping = Date.now();
    let user = message.author.tag;
    const regex = /https?:\/\/.+\.(?:png|jpg|jpeg)/gi;
    if (code.length < 1)
      return code.missing(message, "No code provided", this.help);
    const embed = this.client.util.embed();
    let input = `\`\`\`js\n${code}\`\`\``;
    if (input.length > 1204) input = await this.client.util.hastebin(code);
    embed.addField("📥 INPUT", input);
    try {
      const avatar = (await this.client.snek.get(
        message.author.avatarURL({
          format: "png",
          size: 1024,
          dynamic: true
        }) ||
          this.client.user.avatarURL({
            format: "png",
            size: 1024,
            dynamic: true
          })
      )).body;
      if (!code.startsWith("new Canvas"))
        throw new Error(
          "the command cannot execute without new Canvas(high, width)"
        );
      if (!code.includes(".toBufferAsync()")) code += ".toBufferAsync()";
      code.replace(/;/g, "");
      code.replace(regex, async con => {
        const { body } = await this.client.snek.get(con);
        return body;
      });
      const evaled = await eval(code);
      let filename = 'canvas.png'
      const attachment1 = new MessageAttachment(evaled, filename)
      message.channel.send(attachment1)
      embed.setColor("#00FF12");
      embed.setFooter(`⏱️ ${Date.now() - ping}ms`);
      return message.channel.send(embed);
    } catch (e) {
      let err = `\`\`\`ini\n${e.message}\`\`\``;
      if (err.length > 1204) err = await this.client.util.hastebin(e.message);
      embed.setColor("#FF1200");
      console.log(e)
      embed.addField("⛔ ERROR", err);
      embed.setFooter(`⏱️ ${Date.now() - ping}ms`);
      return message.channel.send(embed);
    }
  }
};

exports.conf = {
  aliases: ["cv"],
  cooldown: ""
};

exports.help = {
  name: "canvas",
  description: "test a canvas-constructor code",
  usage: "canvas <code>"
};
