const { Command } = require('discord-akairo');

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'Core',
			clientPermissions: ['EMBED_LINKS'],
			description: { content: 'Gets the bot invite for Katarina.' }
		});
	}

	async fetchInvite() {
		if (this.invite) return this.invite;
		const invite = await this.client.generateInvite();

		this.invite = invite;
		return invite;
	}

	async exec(message) {
		const embed = this.client.util.embed()
			.setColor("#2f3136")
			.setDescription(`**[Add Katarina to your server!](${await this.fetchInvite()})**`);

		return message.util.send({ embed });
	}
}

module.exports = InviteCommand;