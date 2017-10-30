
/** Class representing a command. */
class Command {
  /**
   * Create a command.
   * @param {string|Array} name - The name of the command. If passed as an
   *     array, the first item of the array is used as the name and the rest of
   *     the items are set as aliases.
   * @param {Command~commandProcess} process - The function to be called when
   *     the command is executed.
   * @param {Object} [help=] - The help information to use when a user targets
   *     this command with the help command.
   */
  constructor (name, process, help = {}) {
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
    this.help = {
      desc: help.desc || null,
      args: help.args || null
    }
    this.source = __filename
  }

  /**
   * @callback Command~commandProcess
   * A function to be called when a command is executed. Accepts information
   * about the message that triggered the command as arguments.
   * @param {Yuuko} c - The client instance that recieved the message triggering
   *     the command.
   * @param {Object} msg - The Eris message object that triggered the command.
   *     For more information, see the Eris documentation:
   *     {@link https://abal.moe/Eris/docs/Message}
   * @param {Array<string>} args - An array of arguments passed to the command,
   *     obtained by removing the command name and prefix from the message, then
   *     splitting on spaces. To get the raw text that was passed to the
   *     command, use `args.join(' ')`.
   */

  /**
   * Returns the help text for a command.
   * @param {string} prefix - The prefix to use when generating the text. Used
   *     in usage examples within the returned text.
   * @returns {string}
   */
  helpText (prefix) {
    let txt = ''
    if (this.help.desc) txt += `**Description:** ${this.help.desc}\n`
    if (this.help.args) txt += `**Usage:** \`${prefix}${this.name} ${this.help.args}\`\n`
    if (this.aliases.length) txt += `**Aliases:** ${this.aliases.map(p => '`' + prefix + p + '`').join(', ')}\n`
    return txt
  }

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
