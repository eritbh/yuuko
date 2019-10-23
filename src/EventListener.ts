import {Client} from 'eris';

/** Class associating an event handler with an event. */
class EventListener {
	private event: Parameters<Client['on']>[0];

	private handler: Parameters<Client['on']>[1];

	constructor (...args: Parameters<Client['on']>) {
		[this.event, this.handler] = args;
	}
}

// The following errors because TS doesn't handle this well:
// https://github.com/microsoft/TypeScript/issues/32164

// new EventListener('messageCreate', message => {
// 	message.channel;
// });
