const { Listener } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			event: 'ready',
			emitter: 'client',
			category: 'client'
		});
	}

	exec() {
		Logger.info(`${this.client.user.tag} is ready to serve!`);
		this.client.user.setActivity('@Katarina Claes help');
	}
}

module.exports = ReadyListener;
