const { Collection, Structures } = require("discord.js");
require("./util/Extensions");

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
        triviaScore: new Map()
      };
    }
  }
  return MusicGuild;
});

const KatarinaClient = require("./struct/KatarinaClient");
const Logger = require("./util/Logger");

const client = new KatarinaClient();

client
  .on("disconnect", () => Logger.warn("Connection lost..."))
  .on("reconnect", () => Logger.info("Attempting to reconnect..."))
  .on("error", err => Logger.error(err))
  .on("warn", info => Logger.warn(info));

client.start();

process.on("unhandledRejection", err => {
  Logger.error("An unhandled promise rejection occured");
  Logger.stacktrace(err);
});
