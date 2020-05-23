const {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  GuildMember,
  ListenerHandler
} = require("discord-akairo");
const { Collection, Structures } = require("discord.js");
const path = require("path");
const Enmap = require("enmap");

class KatarinaClient extends AkairoClient {
  constructor() {
    super(
      { ownerID: process.env.ownerID },
      {
        messageCacheMaxSize: 50,
        messageCacheLifetime: 300,
        messageSweepInterval: 900,
        disableMentions: "everyone",
        disabledEvents: ["TYPING_START"],
        partials: ["MESSAGE"]
      },
      function isOwner(user) {
        const id = this.users.resolveID(user);
        return Array.isArray(this.ownerID)
          ? this.ownerID.includes(id)
          : id === this.ownerID;
      }
    );

    this.db = new require("./Database");
    this.snek = require('node-superfetch');

    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, "..", "commands"),
      aliasReplacement: /-/g,
      prefix: "k!",
      allowMention: true,
      fetchMembers: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      commandUtilSweepInterval: 9e5,
      handleEdits: true,
      defaultCooldown: 2500,
      argumentDefaults: {
        prompt: {
          modifyStart: (msg, text) =>
            text &&
            `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
          modifyRetry: (msg, text) =>
            text &&
            `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
          timeout: msg =>
            `${msg.author} **::** Time ran out, command has been cancelled.`,
          ended: msg =>
            `${msg.author} **::** Too many retries, command has been cancelled.`,
          cancel: msg => `${msg.author} **::** Command has been cancelled.`,
          retries: 4,
          time: 30000
        }
      }
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: path.join(__dirname, "..", "inhibitors")
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, "..", "listeners")
    });

    this.util = require("./Util.js");

    this.config = process.env;

    this.setup();
  }

  setup() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  async start() {
    return this.login(process.env.TOKEN);
  }
}

module.exports = KatarinaClient;
