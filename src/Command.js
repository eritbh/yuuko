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
	}
	return [thing];
}

/** Class representing a command. */
class Command {
	/**
	 * Create a command.
	 * @param {string|Array} name The name of the command. If passed as an
	 * array, the first item of the array is used as the name and the rest of
	 * the items are set as aliases
	 * @param {Command~process} process The function to be called when
	 * the command is executed
	 * @param {Object} requirements A set of requirements for the command to be
	 * executed
	 * @param {boolean} requirements.owner Whether to restrict the command's
	 * use to the bot's OAuth app owner
	 * @param {string|Array<string>} requirements.permissions One or more
	 * permission names that a person must have in order to use the command. The
	 * list of permission names can be found in the Eris documentation, under
	 * the "Eris.Constants.Permissions" section:
	 * {@link https://abal.moe/Eris/docs/reference}
	 * @param {Command~customRequirement} requirements.custom A function which
	 * must return a truthy value to let a user use the command
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
		if (requirements.custom) this.requirements.custom = requirements.custom;
	}

	/**
	 * @callback Command~process
	 * A function to be called when a command is executed. Accepts information
	 * about the message that triggered the command as arguments
	 * @this {Client} The client that received the command message
	 * @param {Eris.Message} msg The message triggering the command
	 * @param {Array<string>} args - An array of arguments passed to the
	 * command, obtained by removing the command name and prefix from the
	 * message, then splitting on spaces
	 * @param {string} prefix - The prefix used in the message
	 * @param {string} commandName - The name or alias used to call the command
	 * in the message
	 */

	/**
	 * @callback Command~customRequirement
	 * A function called when checking whether a user has permission to use a
	 * command or not. Return truthy if the user should be allowed to use it,
	 * falsy if they should not.
	 * @this {Client} The client that received the command message
	 * @param {Eris.Message} msg The message triggering the command
	 */

	/**
	 * Checks whether or not a command can be executed.
	 * @param {Client} client The client that received the command message
	 * @param {Eris.Message} msg The message triggering the command
	 * @returns {Promise<Boolean>} Whether or not the command can be executed
	 */
	async checkPermissions (client, msg) {
		const {owner, permissions, custom} = this.requirements;
		// Owner checking
		if (owner && client.app.owner.id !== msg.author.id) {
			return false;
		}
		// Permissions
		if (permissions && permissions.length > 0) {
			// If we require permissions, the command can't be used in direct messages
			if (!msg.channel.guild) {
				return false;
			}
			// Calculate permissions of the user and check all we need
			const memberPerms = msg.channel.permissionsOf(msg.author.id);
			for (const permission of permissions) {
				if (!memberPerms.has(permission)) {
					return false;
				}
			}
		}
		// Custom requirement function
		if (custom && !await custom.call(client, msg)) {
			return false;
		}
		// If we haven't returned yet, all requirements are met
		return true;
	}

	/**
	 * Executes the command process if the permission checks pass.
	 * @param {Client} client The client that received the command message
	 * @param {Eris.Message} msg The message triggering the command
	 * @param {Array<string>} args - An array of arguments passed to the
	 * command, obtained by removing the command name and prefix from the
	 * message, then splitting on spaces
	 * @param {string} prefix - The prefix used in the message
	 * @param {string} commandName - The name or alias used to call the command
	 * in the message
	 */
	async execute (client, msg, args, prefix, commandName) {
		if (!await this.checkPermissions(client, msg)) return;
		this.process.call(client, msg, args, prefix, commandName);
	}

	/** @prop {Array<string>} names All names the command is callable by */
	get names () {
		return [this.name, ...this.aliases];
	}
}

module.exports = Command;
