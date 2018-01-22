'use strict'

/** Class representing a command. */
class Command {
	/**
   * Create a command.
   * @param {string|Array} name - The name of the command. If passed as an
   *     array, the first item of the array is used as the name and the rest of
   *     the items are set as aliases.
   * @param {Command~commandProcess} process - The function to be called when
   *     the command is executed.
   */
	constructor (name, process) {
		if (Array.isArray(name)) {
			this.name = name.splice(0, 1)[0]
			this.aliases = name
		} else {
			this.name = name
			this.aliases = []
		}
		if (!this.name) throw new TypeError('Name is required')
		this.process = process
		if (!this.process) throw new TypeError('Process is required')
	}

	/**
   * @callback Command~commandProcess
   * A function to be called when a command is executed. Accepts information
   * about the message that triggered the command as arguments.
   * @this {Yuuko} The client instance that recieved the message triggering the
   *     command.
   * @param {Object} msg - The Eris message object that triggered the command.
   *     For more information, see the Eris documentation:
   *     {@link https://abal.moe/Eris/docs/Message}
   * @param {Array<string>} args - An array of arguments passed to the command,
   *     obtained by removing the command name and prefix from the message, then
   *     splitting on spaces. To get the raw text that was passed to the
   *     command, use `args.join(' ')`.
   * @param {string} prefix - The prefix used in the message.
   * @param {string} commandName - The name or alias used to call the command in
   *     the message. Will be one of the values of `this.names`.
   */

	/**
   * All names that can be used to invoke the command - its primary name in
   * addition to its aliases.
   * @type {Array<string>}
   */
	get names () {
		return [this.name, ...this.aliases]
	}
}

module.exports = Command
