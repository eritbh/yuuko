'use strict';

const Command = require('../src/Command');
const moment = require('moment-timezone');
const childProcess = require('child_process');
const packageJson = require.main.require('./package.json');
const log = require('another-logger');

// Store the current tagged version and commit SHA
let versionTag;
let versionSHA;
childProcess.exec('git describe --abbrev=0 --tags && git rev-parse --short HEAD', (err, stdout) => {
	if (err) {
		versionTag = '???';
		versionSHA = 'Unknown';
		log.error('Error parsing Git version:', err);
		return;
	}
	[versionTag, versionSHA] = stdout.split('\n');
});

module.exports = new Command(['about', 'uptime', 'info'], async function about (msg, args, prefix) {
	const uptimeDuration = moment.duration(this.uptime).humanize();
	const uptimeStart = moment().subtract(this.uptime).tz('America/New_York').format('YYYY-DD-mm kk:mm z');
	const link = packageJson.homepage;
	const owner = this.app ? `\`\`${this.app.owner.username}#${this.app.owner.discriminator}\`\`` : 'Owner information unavailable, try again in a bit';

	const content = `**=== About Yuuko ===**
*Use \`${prefix}help\` to get help using the bot.*
**Server:** https://discord.gg/a2N2YCx
**Project:** ${link}
**Owner:** ${owner}
**Version:** ${versionTag} (Commit: ${versionSHA})
**Uptime:** ${uptimeDuration} (since ${uptimeStart})
**Ping:** Wait for it...`;

	const then = Date.now();
	try {
		const newmsg = await msg.channel.createMessage(content);
		const diff = Date.now() - then;
		await newmsg.edit(newmsg.content.replace('Wait for it...', `${diff}ms`));
	} catch (_) {
		// pass
	}
});
module.exports.help = {
	desc: 'Displays information about the bot, including running version, time since last crash, and a link to its source code.',
	args: '',
};
