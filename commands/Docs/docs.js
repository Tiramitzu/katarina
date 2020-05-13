const { Command } = require("discord-akairo");
const { qs } = require("querystring");
const SOURCES = [
  "stable",
  "master",
  "rpc",
  "commando",
  "akairo",
  "akairo-master",
  "v11",
  "11.6.4",
  "11.5.1",
  "collection"
];
const fetch = require("node-superfetch");

const DocsCommandArguments = {
  source: String,
  force: Boolean,
  includePrivate: Boolean,
  query: String
};

class DocsCommand extends Command {
  constructor() {
    super("docs", {
      aliases: ["docs"],
      description: {
        content: "Searches discord.js documentation",
        usage: "<query>",
        examples: [
          "TextChannel",
          "Client",
          "ClientUser#setActivity --src=master"
        ]
      },
      category: "Docs",
      ratelimit: 2,
      flags: ["--force", "-f", "--private", "-p"],
      optionFlags: ["--default=", "--src="]
    });
  }

  *args() {
    const defaultDocs = yield {
      match: "option",
      flag: "--default="
    };

    const source = yield {
      match: "option",
      flag: "--src="
    };

    const force = yield {
      match: "flag",
      flag: ["--force", "-f"]
    };

    const includePrivate = yield {
      match: "flag",
      flag: ["--private", "-p"]
    };

    const query = yield {
      match: "rest",
      type: "lowercase",
      prompt: {
        start: (msg, text) =>
          `${msg.author}, what would you like to search for?`
      }
    };

    return { source, force, includePrivate, query };
  }

  async exec(
    message,
    { source, force, includePrivate, query } = DocsCommandArguments
  ) {
    const guild = message.guild;

    const q = query.split(" ");
    if (!SOURCES.includes(source)) {
      source = "stable";
    }
    if (source === "v11" || source === "11.6.4" || source === "11.5.1") {
      source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
    }
    const queryString = qs.stringify({
      src: source,
      q: q.join(" "),
      force,
      includePrivate
    });
    const res = await fetch(
      `https://djsdocs.sorta.moe/v2/embed?${queryString}`
    );
    const embed = await res.json();
    if (!embed) {
      return message.util.reply(
        "Katarina couldn't find the requested information. Maybe look for something that actually exists the next time!"
      );
    }
    if (message.channel.type === "dm") {
      return message.util.send({ embed });
    }
    const msg = await message.util.send({ embed });
    if (!msg) return message;

    return message;
  }
}

module.exports = DocsCommand;
