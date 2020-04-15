import {Client} from './Client';
import Eris from 'eris';

/** Class associating an event handler with an event. */
export class EventListener {
	args: Parameters<Client["on"]>;

	constructor (event: 'messageCreate', handler: (msg: Eris.Message) => any);
	constructor (event: 'channelCreate', handler: (channel: Eris.Channel) => any);

	constructor (event: string, handler: Function) {
		this.args = [event, handler];
	}
}
