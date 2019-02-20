import {Command} from '../src/Yuuko';

export default new Command('ping', async msg => {
	const then = Date.now();
	try {
		const newmsg = await msg.channel.createMessage("I'm here.");
		const diff = Date.now() - then;
		await newmsg.edit(`${newmsg.content} (${diff}ms)`);
	} catch (_) {
		// Missing permissions, we don't need to worry here
	}
});
export const help = {
	desc: 'Pings the bot.',
	args: '',
};
