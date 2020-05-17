/** @module Yuuko */

import {Command} from '../Yuuko';

export default new Command(['setstatus', 'setgame'], (msg, args, {client}) => {
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
			if (status) {
				args.unshift(status);
			}
			status = 'online';
	}
	const game = args.join(' ');
	// @ts-ignore // TODO
	client.editStatus(status, game ? {name: game} : undefined);
}, {
	owner: true,
});
