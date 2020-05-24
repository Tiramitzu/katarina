const { Command } = require("discord-akairo")

module.exports = class PlayCommand extends Command {
  constructor(){
    super("play", {
      aliases: ["Music"],
      description: {
        content: "Play music",
        usage: "<query>",
        examples: [
          "Counting stars",
          "Client",
          "https://youtube.com/watch?v=XxXxXxXxXxX"
        ]
      },
      category: "Music",
    })
  }
  
  args() {
    const query = yield {
      match: "content",
      prompt: {
        start: (msg, text) =>
          `${msg.author}, what would you like to play music?`
      }
    };
    
    return { query }
  }
  
  async exec(message, { query })
}
