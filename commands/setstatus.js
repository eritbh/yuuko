'use strict';

const Command = require('../src/Command');

module.exports = new Command(['setstatus', 'setgame'], function setstatus (msg, args) {
	let status = args.shift();
	switch (status) {
		case 'dnd':
		case 'red':
			status = 'dnd';
			break;
		case 'idle':
		case 'yellow':
			status = 'idle';
			break;
		case 'invisible':
		case 'invis':
		case 'grey':
		case 'none':
			status = 'invisible';
			break;
		case 'online':
		case 'green':
			status = 'online';
			break;
		default:
			args.unshift(status);
			status = 'online';
	}
	const game = args.join(' ');
	this.editStatus(status, game ? {name: game} : undefined).catch(() => {});
}, {
	owner: true,
});
