const { Command } = require("discord-akairo");

module.exports = class StopMusicTriviaCommand extends Command {
  constructor() {
    super("stop-trivia", {
      aliases: [
        "stop-music-trivia",
        "skip-trivia",
        "end-trivia",
        "stop-trivia"
      ],
      category: "Music",
      description: { content: "End the music trivia" },
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"]
    });
  }
  exec(message) {
    if (!message.guild.triviaData.isTriviaRunning)
      return message.util.send("No trivia is currently running");

    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.util.send("Join the trivia's channel and try again");
    }

    if (!message.guild.triviaData.triviaScore.has(message.author.username)) {
      return message.util.send(
        "You need to participate in the trivia in order to end it"
      );
    }

    message.guild.triviaData.triviaQueue.length = 0;
    message.guild.triviaData.wasTriviaEndCalled = true;
    message.guild.triviaData.triviaScore.clear();
    message.guild.musicData.songDispatcher.end();
    return;
  }
};
