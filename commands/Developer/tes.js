const { Command } = require("discord-akairo");
const { Canvas } = require("canvas-constructor");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { get } = require("node-superfetch");
const { loadImage } = require("canvas");

module.exports = class TesCommand extends Command {
  constructor() {
    super("tes", {
      aliases: ["tes", "t"],
      category: "Developer",
      ownerOnly: true,
      quoted: false,
      description: {
        content: "Tes."
      }
    });
  }

  async exec(message) {
    let def = await this.client.snek
      .get("https://www.instagram.com/zealcord/?__a=1 ")
      .then(x => x.body.graphql.user);

    const { body: background } = await get(
      "https://cdn.discordapp.com/attachments/691120588445450283/706425029256151090/p.png"
    );
    const { body: frontground } = await get(
      "https://cdn.discordapp.com/attachments/691120588445450283/706422297480921160/Profile.png"
    );

    let ava = await this.client.snek
      .get("https://www.instagram.com/zealcord/?__a=1")
      .then(x => x.body.graphql.user.profile_pic_url_hd);

    const name =
      message.author.tag.length > 25
        ? message.author.tag.substring(0, 22) + "..."
        : message.author.tag;

    const ping = Date.now();
    let user = message.author.tag;

    const cvs1 = new Canvas(500, 500)
      .addCircularImage(ava, 125, 125, 100)
      .toBuffer();

    const cvs = new Canvas(1000, 500)
      .setColor("white")
      .addRect(1, 1, 1000, 500)
      .save()
      .setColor("#2C2F33")
      .setShadowColor("rgba(22, 22, 22, 1)")
      .setShadowOffsetY(5)
      .setShadowBlur(10)
      .addCircle(125, 125, 100)
      .addCircularImage(ava, 125, 125, 100)
      .save()
      .toBuffer();

    //const attachment1 = new MessageAttachment(cvs, "test.png");
    const avat = new MessageAttachment(cvs1, "test1.png");
    //message.channel.send(attachment1);
    message.channel.send(avat);
  }
};
