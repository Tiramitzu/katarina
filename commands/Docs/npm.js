const { Command }  = require('discord-akairo');
const moment = require('moment');
require('moment-duration-format');
const fetch = require('node-fetch');

module.exports = class NPMCommand extends Command {
	constructor() {
		super('npm', {
			aliases: ['npm', 'npm-package'],
			category: 'Docs',
			description: {
				content: "Responds with information on an NPM package.",
				usage: '<query>',
				examples: ['discord.js', 'discord-akairo', 'node-fetch'],
			},
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					id: 'pkg',
					prompt: {
						start: (message) => "what would you like to search for?",
					},
					match: 'content',
					type: (_, pkg) => (pkg ? encodeURIComponent(pkg.replace(/ /g, '-')) : null),
				},
			],
		});
	}

	async exec(message, { pkg } = { pkg: String }) {
		const res = await fetch(`https://registry.npmjs.com/${pkg}`);
		if (res.status === 404) {
			return message.util.reply("Katarina couldn't find the requested information. Maybe look for something that actually exists the next time!");
		}
		const body = await res.json();
		if (body.time.unpublished) {
			return message.util.reply("Whoever was the Commander of this package decided to unpublish it, what a fool.");
		}
		const version = body['dist-tags'] ? body.versions[body['dist-tags'].latest] : {};
		const maintainers = this.trimArray(body.maintainers.map((user = { name: String }) => user.name));
		const dependencies = version.dependencies ? this.trimArray(Object.keys(version.dependencies)) : null;
		const embed = this.client.util.embed()
			.setColor(0xcb0000)
			.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
			.setTitle(body.name)
			.setURL(`https://www.npmjs.com/package/${pkg}`)
			.setDescription(body.description || 'No description.')
			.addField('❯ Version', body['dist-tags'].latest ? body['dist-tags'].latest: 'Unknown', true)
			.addField('❯ License', body.license || 'None', true)
			.addField('❯ Author', body.author ? body.author.name : 'Unknown', true)
			.addField('❯ Creation Date', moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Modification Date', moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Main File', version.main || 'index.js', true)
			.addField('❯ Dependencies', dependencies.length ? dependencies.join(', ') : 'None')
			.addField('❯ Maintainers', maintainers.join(', '));

		return message.util.send(embed);
	}

	trimArray(arr = String) {
		if (arr.length > 10) {
			const len = arr.length - 10;
			arr = arr.slice(0, 10);
			arr.push(`${len} more...`);
		}

		return arr;
	}
}