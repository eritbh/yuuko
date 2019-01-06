'use strict';

const {Client} = require('./src/Yuuko');
const path = require('path');
const log = require('another-logger');
const config = require('./config');
const superagent = require('superagent');

const c = new Client(config);

// Event logging
c.on('commandLoaded', command => {
	log.debug(`Command ${command.name} loaded${command.filename ? ` from ${command.filename}` : ''}.`);
});
c.on('ready', () => {
	log.success(`Logged in as @${c.user.username}#${c.user.discriminator} in ${c.guilds.size} guild${c.guilds.size === 1 ? '' : 's'}, ${c.commands.length} command${c.commands.length === 1 ? '' : 's'}`);
});
c.on('command', (command, msg) => {
	log.command(`${command.name} from user ${msg.author.id} in channel ${msg.channel.id}`);
});
c.on('error', (error, shard) => {
	log.error(`[shard ${shard}] ${error}`);
});
c.on('warn', (warn, shard) => {
	log.warn(`[shard ${shard}] ${warn}`);
});
c.on('debug', (debug, shard) => {
	log.erisDebug(`[shard ${shard}] ${debug}`);
});
process.on('warning', warning => { // for best results, run with --no-warnings
	log.warn(`${warning.name}: ${warning.message}`);
});

// Add commands and connect
c.addCommandDir(path.join(__dirname, 'commands')).connect();
