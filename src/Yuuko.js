'use strict'

const Eris = require('eris')
const glob = require('glob')
const util = require('util')
const Command = require('./Command')
const reload = require('require-reload')(require)

const u = require('./util.js')

/** The client. */
class Yuuko extends Eris.Client {
  /**
   * Create a client instance.
   * @param {Object} options - Options to start the client with. This object is
   *     also passed to Eris.
   * @param {string} options.token - The token used to log into the bot.
   * @param {string} options.defaultPrefix - The prefix the bot will respond to
   *     in guilds for which there is no other confguration.
   * @param {boolean} options.allowMention - Whether or not the bot can respond
   *     to messages starting with a mention of the bot.
   */
  constructor (options = {}) {
    super(options.token, options) // TODO: Use the same help object for Eris and Yuuko options

    /**
     * @prop {string} - The prefix the bot will respond to in guilds for which
     *     there is no other confguration.
     */
    this.defaultPrefix = options.defaultPrefix

    /**
     * @prop {boolean} - Whether or not the bot can respond to messages starting
     *     with a mention of the bot.
     */
    this.allowMention = options.allowMention == null ? true : options.allowMention

    /**
     * @prop {Array<Command>} - An array of commands the bot will respond to.
     *     respond to.
     */
    this.commands = []

    this.on('ready', () => {
      /**
       * @prop {RegExp} - The RegExp used to tell whether or not a message starts
       *     with a mention of the bot. Only present after the 'ready' event.
       */
      this.mentionPrefixRegExp = new RegExp(`^<@!?${this.user.id}>\\s?`)

      u.ok('Logged in as', u.underline(`@${this.user.username}#${this.user.discriminator}`), `- in ${this.guilds.size} guild${this.guilds.size === 1 ? '' : 's'}`)
    }).on('error', err => {
      u.error('Error in client:\n', err)
    }).on('messageCreate', this.handleMessage)
  }

  /**
   * Given a message, see if there is a command and process it if so.
   * @param {Object} msg - The message object recieved from Eris.
   */
  handleMessage (msg) {
    const [prefix, content] = this.splitPrefixFromContent(msg)
    if (!content) return
    let args = content.split(' ')
    const commandName = args.splice(0, 1)[0]
    const command = this.commandForName(commandName)
    if (!command) return

    command.process.call(this, msg, args, prefix)
    u.info('did a thing:', commandName, args.join(' '))
  }

  /**
   * Register a command to the client.
   * @param {Command} command - The command to add to the bot.
   */
  addCommand (command) {
    if (!(command instanceof Command)) throw new TypeError('Not a command')
    if (this.commandForName(command.name)) u.warn(`Duplicate command found (${command.name})`)
    this.commands.push(command)
    return this
  }

  /**
   * Load all the JS files in a directory and attempt to load them each as
   * commands.
   * @param {string} dirname - The location of the directory.
   */
  addCommandDir (dirname) {
    if (!dirname.endsWith('/')) dirname += '/'
    const pattern = dirname + '*.js'
    const filenames = glob.sync(pattern)
    for (let filename of filenames) {
      this.addCommandFile(filename)
    }
    return this
  }

  /**
   * Load a command exported from a file.
   * @param {string} filename - The location of the file.
   */
  addCommandFile (filename) {
    try {
      const command = reload(filename)
      command.filename = filename
      this.addCommand(command)
      u.ok('Added command from', filename)
    } catch (e) {
      u.warn('Command from', filename, "couldn't be loaded.\n", e)
    }
    return this
  }

  /**
   * Reloads all commands that were loaded via `addCommandFile` and
   * `addCommandDir`. Useful for development to hot-reload commands as you work
   * on them.
   */
  reloadCommands () {
    let i = this.commands.length
    while (i--) {
      const command = this.commands[i]
      if (command.filename) {
        this.commands.splice(i, 1)
        this.addCommandFile(command.filename)
      }
    }
    return this
  }

  /**
   * Checks the list of registered commands and returns one whch is known by a
   * given name, either as the command's name or an alias of the command.
   * @param {string} name - The name of the command to look for.
   * @returns {Command|null}
   */
  commandForName (name) {
    return this.commands.find(c => [c.name, ...c.aliases].includes(name))
  }

  /**
   * Returns the appropriate prefix string to use for commands based on a
   * certain message.
   * @param {Object} msg - The message to check the prefix of.
   * @returns {string}
   */
  prefixForMessage (msg) {
    // TODO
    if (msg.channel.guild) return this.defaultPrefix
    return ''
  }

  /**
   * Takes a message, gets the prefix based on the config of any guild it was
   * sent in, and returns the message's content without the prefix if the
   * prefix matches, and `null` if it doesn't.
   * @param {Object} msg - The message to process
   * @returns {Array<String|null>}
   **/
  splitPrefixFromContent (msg) {
    // Traditional prefix handling - if there is no prefix, skip this rule
    const prefix = this.prefixForMessage(msg) // TODO: guild config
    if (prefix != null && msg.content.startsWith(prefix)) {
      return [prefix, msg.content.substr(prefix.length)]
    }
    // Allow mentions to be used as prefixes according to config
    const match = msg.content.match(this.mentionPrefixRegExp)
    if (this.allowMention && match) { // TODO: guild config
      return [match[0], msg.content.substr(match[0].length)]
    }
    // Allow no prefix in direct message channels
    if (!msg.channel.guild) {
      return ['', msg.content]
    }
    // we got nothing
    return [null, null]
  }

  // /**
  //  * Creates a message. If the specified message content is longer than 2000
  //  * characters, splits the message intelligently into chunks until each chunk
  //  * is less than 2000 characters, then sends each chunk as its own message.
  //  * Embeds and files are sent with the last message and are otherwise
  //  * unaffected.
  //  * @param content
  //  * @param
  //  * @TODO everything
  //  */
  // _createMessageChunked (channelId, content, file, maxLength = 2000) {
  //   let embed
  //   if (typeof content === 'object') {
  //     embed = content.embed
  //     content = content.content
  //   } else {
  //     embed = null
  //   }
  //   let self = this
  //   ;(function sendChunk (left) {
  //     console.log(left.length)
  //     if (left.length < maxLength) return self.createMessage(channelId, {content, embed}, file)
  //     let newlineIndex = left.substr(0, maxLength).lastIndexOf('\n')
  //     if (newlineIndex < 1) newlineIndex = maxLength - 1
  //     console.log(newlineIndex)
  //     left = left.split('')
  //     const chunk = left.splice(0, newlineIndex)
  //     if (!left.length) {
  //       // Interesting, the message was exactly good. We'll put the embed and stuff in now.
  //       return self.createMessage(channelId, {content: chunk, embed: embed}, file)
  //     }
  //     sendChunk(left.join(''), maxLength)
  //   }(content))
  // }

  /**
   * Evaluates a JavaScript string in the bot's scope and returns the result
   * converted to a string and formatted for sending as a message. This is
   * only here to make the eval command possible and should not be used in
   * other contexts.
   * @param {string} script - The script to run.
   * @returns {string} - A Markdown-formatted message that represents the
   *     output of the command. Includes both console logs and the final
   *     evaluated expression's result.
   */
  eval (text) {
    let og = console.log
    let response
    let ___console = '' // trying really hard to make this not noticeable
    text = `console.log = function (...args) {
            ___console += args.join(' ') + '\\n'
        };` + text.toString()
    try {
      response = eval(text) // eslint-disable-line no-eval
    } catch (e) {
      response = e
    }
    console.log = og
    ___console = ___console.split(/\n/g).map(line => line ? '//> ' + line : '').join('\n').replace(/\n+$/, '')
    return '```js\n' + ___console + ((___console && response === undefined) ? '' : util.inspect(response)) + '\n```'
  }
}

Yuuko.Command = Command

module.exports = Yuuko
