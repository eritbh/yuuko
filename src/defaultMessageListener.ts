import {EventListener} from './EventListener';

export default new EventListener('messageCreate', (msg, {client}) => {
	if (!msg.author) return; // this is a bug and shouldn't really happen
	if (client.ignoreBots && msg.author.bot) return;

	client.processCommand(msg);
});
