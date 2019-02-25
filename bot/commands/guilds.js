'use strict';

const {Command} = require('../../src/Command');

module.exports = new Command('guilds', function guilds (msg, args, {client}) {
	const guildList = `\`\`\`\n${
		Array.from(client.guilds.values())
			// Descending sort
			.sort((a, b) => b.members.size - a.members.size)
			// Take top 10 entries
			.slice(0, 10)
			// Generate line for each guild
			.map((g, i) => {
				const number = `${i + 1}.`.padStart(4);
				const users = `${g.members.size}`.padStart(6);
				return `${number} ${users}  ${g.name}`;
			})
			// Join lines
			.join('\n')
	}\n\`\`\``;
	msg.channel.createMessage(`**=== Guilds ===**\nTotal: ${client.guilds.size}\n${guildList}`);
}, {
	owner: true,
});
