const { Command } = require("discord-akairo");
const Logger = require("../../util/Logger");
const util = require("util");
const { post } = require("node-superfetch");
const { MessageEmbed } = require("discord.js");
const moment = require("moment")
require("moment-duration-format");

class EvalCommand extends Command {
  constructor() {
    super("eval", {
      aliases: ["eval", "e"],
      category: "Developer",
      ownerOnly: true,
      quoted: false,
      args: [
        {
          id: "code",
          match: "content"
        }
      ],
      description: {
        content: "Evaluates code.",
        usage: "<code>"
      }
    });
  }

  async exec(message, { code }) {
    var msg = message;
    var client = this.client;
    var bot = this.client;
    var Claes = this.client;
    var Katarina = this.client;
    var claes = this.client;
    var katarina = this.client;
    const embed = this.client.util.embed().setColor("#2f3136");

    try {
      if (!code) return;
      let evaled;
      //if (code.includes("--async")) {
      //  let code1 = code.slice("--async");
      ///  evaled = await eval(code1);
      //} else {
      //  evaled = eval(code);
      //}
      if (code.includes(`token`)) {
        evaled = "LOSER GBLK!!! >:VVVVV";
      } else {
        evaled = await eval(code);
      }
      var tipe2 = {
        string: "String",
        number: "Number",
        boolean: "Boolean",
        array: "Array",
        object: "Object",
        function: "Function"
      };
      var tipe1 = typeof evaled;
      var tipe = tipe2[tipe1];

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth: 0 });

      let output = clean(evaled);
      if (output.length > 2048) {
        const { body } = await post("https://bin.tiramitzu.xyz/documents").send(
          output
        );
        embed.setAuthor("Output");
        embed.setDescription(`https://bin.tiramitzu.xyz/${body.key}.js`);
      } else {
        embed.setAuthor("Output");
        embed.setDescription("```js\n" + output + "```");
        embed.addField("Type", "```js\n" + tipe + "```");
      }
      message.util.send(embed);
    } catch (e) {
      let error = clean(e);
      if (error.length > 2048) {
        const { body } = await post("https://bin.tiramitzu.xyz/documents").send(
          error
        );
        embed.setAuthor("Output");
        embed.setURL(`https://bin.tiramitzu.xyz/${body.key}.js`);
      } else {
        embed.setAuthor("Error");
        embed.setDescription("```js\n" + error + "```");
      }
      message.util.send(embed);
    }

    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
  }
}

module.exports = EvalCommand;
