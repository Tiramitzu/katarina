const { Command } = require("discord-akairo");

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "halp", "h"],
      category: "Core",
      clientPermissions: ["EMBED_LINKS"],
      args: [
        {
          id: "command",
          type: "commandAlias",
          prompt: {
            start: "Which command do you need help with?",
            retry: "Please provide a valid command.",
            optional: true
          }
        }
      ],
      description: {
        content: "Displays a list of commands or information about a command.",
        usage: "[command]",
        examples: ["", "stats", "ping"]
      }
    });
  }

  exec(message, { command }) {
    if (!command) return this.execCommandList(message);

    const prefix = "k!";
    const description = Object.assign(
      {
        content: "No description available.",
        usage: "",
        examples: [],
        fields: []
      },
      command.description
    );

    const embed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setDescription(`\`[]\` = Optional
\`<>\` = Required
\`()\` = Information`)
      .setTitle(`\`${prefix}${command.aliases[0]} ${description.usage}\``)
      .addField("Description", description.content);

    for (const field of description.fields)
      embed.addField(field.name, field.value);

    if (description.examples.length) {
      const text = `${prefix}${command.aliases[0]}`;
      embed.addField(
        "Examples",
        `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``,
        true
      );
    }

    if (command.aliases.length > 1) {
      embed.addField("Aliases", `\`${command.aliases.join("` `")}\``, true);
    }

    return message.util.send({ embed });
  }

  async execCommandList(message) {
    const embed = this.client.util
      .embed()
      .setColor("#2f3136")
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter('Requested By: '+message.author.tag, message.author.displayAvatarURL())
      .setAuthor(
        this.client.user.username + " Command List",
        this.client.user.displayAvatarURL()
      ).setDescription(`
					To view details for a command, do \`k!help <command>\`
\`[]\` = Optional
\`<>\` = Required
\`()\` = Information`);

    for (const category of this.handler.categories.values()) {
      const title = {
        Core: "⚙️\u2000Core",
        Music: ":musical_note:\u2000Music"
      }[category.id];

      if (title)
        embed.addField(
          title,
          `\`${category.map(cmd => cmd.aliases[0]).join("`, `")}\``
        );
    }

    const shouldReply =
      message.guild &&
      message.channel.permissionsFor(this.client.user).has("SEND_MESSAGES");

    try {
      await message.channel.send({ embed });
      //if (shouldReply) return message.util.reply('I\'ve sent you a DM with the command list.');
    } catch (err) {
      if (shouldReply)
        return message.util.reply(
          "I could not send you the command list in DMs."
        );
    }

    return undefined;
  }
}

module.exports = HelpCommand;
