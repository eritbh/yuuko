'use strict';

/**
 * Takes an object and returns it inside an array, or unmodified if it is
 * already an array. If undefined is passed, an empty array is returned.
 * @param {*} thing The object.
 * @returns {Array} The array-ified object.
 */
function makeArray (thing) {
	if (Array.isArray(thing)) {
		return thing;
	} else if (thing === undefined) {
		return [];
	} else {
		return [thing];
	}
}

/** Class representing a command. */
class Command {
	/**
	 * Create a command.
	 * @param {string|Array} name - The name of the command. If passed as an
	 * array, the first item of the array is used as the name and the rest of the
	 * items are set as aliases.
	 * @param {Command~commandProcess} process - The function to be called when
	 * the command is executed.
	 */
	constructor (name, process, requirements = {}) {
		if (Array.isArray(name)) {
			this.name = name.splice(0, 1)[0];
			this.aliases = name;
		} else {
			this.name = name;
			this.aliases = [];
		}
		if (!this.name) throw new TypeError('Name is required');
		this.process = process;
		if (!this.process) throw new TypeError('Process is required');
		this.requirements = {};
		if (requirements.owner) this.requirements.owner = true;
		if (requirements.permissions) this.requirements.permissions = makeArray(requirements.permissions);
		if (requirements.custom) this.requirements.custom = makeArray(requirements.custom);
	}

	/**
	 * @callback Command~commandProcess
	 * A function to be called when a command is executed. Accepts information
	 * about the message that triggered the command as arguments.
	 * @this {Yuuko} The client instance that recieved the message triggering the
	 * command.
	 * @param {Object} msg - The Eris message object that triggered the command.
	 * For more information, see the Eris documentation:
	 * {@link https://abal.moe/Eris/docs/Message}
	 * @param {Array<string>} args - An array of arguments passed to the command,
	 * obtained by removing the command name and prefix from the message, then
	 * splitting on spaces. To get the raw text that was passed to the command,
	 * use `args.join(' ')`.
	 * @param {string} prefix - The prefix used in the message.
	 * @param {string} commandName - The name or alias used to call the command in
	 * the message. Will be one of the values of `this.names`.
	 */

	/**
	 * Checks whether or not a command can be executed.
	 * @param {Yuuko} client - The client instance that recieved the message
	 * triggering the command.
	 * @param {Object} msg - The Eris message object that triggered the command.
	 * For more information, see the Eris documentation:
	 * {@link https://abal.moe/Eris/docs/Message}
	 * @returns {Promise<Boolean>} Whether or not the command can be executed.
	 */
	async checkPermissions (client, msg) {
		return new Promise(async resolve => {
			const {owner, permissions, custom} = this.requirements;
			// Owner checking
			if (owner && client.app.owner.id !== msg.author.id) {
				return resolve(false);
			}

			// Permissions
			if (permissions && permissions.length > 0) {
				// If we require permissions, the command can't be used in direct messages
				if (!msg.channel.guild) {
					return resolve(false);
				}
				// Calculate permissions of the user and check all we need
				const memberPerms = msg.channel.permissionsOf(msg.author.id);
				for (let permission of permissions) {
					if (!memberPerms.has(permission)) {
						return resolve(false);
					}
				}
			}

			// Custom requirements
			if (custom) {
				const vals = await Promise.all(custom.map(f => f.call(this, msg, client)));
				if (vals.some(val => !val)) return resolve(false);
			}

			// If we haven't returned yet, all requirements are met
			resolve(true);
		});
	}

	/**
	 * Executes the command process if the permission checks pass.
	 * @param {Yuuko} client - The client instance that recieved the message
	 * triggering the command.
	 * @param {Object} msg - The Eris message object that triggered the command.
	 * For more information, see the Eris documentation:
	 * {@link https://abal.moe/Eris/docs/Message}
	 * @param {Array<string>} args - An array of arguments passed to the command,
	 * obtained by removing the command name and prefix from the message, then
	 * splitting on spaces. To get the raw text that was passed to the
	 * command, use `args.join(' ')`.
	 * @param {string} prefix - The prefix used in the message.
	 * @param {string} commandName - The name or alias used to call the command in
	 * the message. Will be one of the values of `this.names`.
	 */
	async execute (client, msg, args, prefix, commandName) {
		if (!await this.checkPermissions(client, msg)) return;
		this.process.call(client, msg, args, prefix, commandName);
	}

	/**
	 * All names that can be used to invoke the command - its primary name in
	 * addition to its aliases.
	 * @type {Array<string>}
	 */
	get names () {
		return [this.name, ...this.aliases];
	}
}

module.exports = Command;
