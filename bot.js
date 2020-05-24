const { Collection, Structures } = require("discord.js");
const { ErelaClient } = require("erela.js")
require("./server");
require("./util/Extensions");
require("dotenv").config()

Structures.extend("Guild", function(Guild) {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        userGuessed: new Map(),
        triviaScore: new Map()
      };
    }
  }
  return MusicGuild;
});

client.music = ErelaClient(client, [
  {
    host: "localhost",
    port: 7777,
    password: process.env.PASSWORD
  }
])

client.music.on("nodeConnect", node => console.log(node))

const KatarinaClient = require("./struct/KatarinaClient");
const Logger = require("./util/Logger");

const client = new KatarinaClient();

client
  .on("shardDisconnect", () => Logger.warn("Connection lost..."))
  .on("shardReconnect", () => Logger.info("Attempting to reconnect..."))
  .on("error", err => Logger.error(err))
  .on("warn", info => Logger.warn(info));

client.start();

process.on("unhandledRejection", err => {
  Logger.error("An unhandled promise rejection occured");
  Logger.stacktrace(err);
});
