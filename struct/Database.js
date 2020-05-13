const Enmap = require("enmap")

class DatabaseManager extends Enmap {
  constructor(){
    super({
      name: "db",
      fetchAll: true
    })
  }
}

module.exports = new DatabaseManager