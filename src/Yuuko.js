'use strict'

const Eris = require('eris')
const glob = require('glob')
const Command = require('./Command')

/** The client. */
class Yuuko extends Eris.Client {
    /**
     * Create a client instance.
     * @param {object} options - Options to start the client with. This object is
     *     also passed to Eris.
     */
    constructor (options = {}) {
        super(options.token, options) // TODO: Use the same help object for Eris and Yuuko options
        this.useHelp = options.help == null ? true : options.help
        this.defaultPrefix = options.defaultPrefix || 'CHANGE YOUR PREFIX CONFIG'
        this.commands = []

        this.on('ready', () => {
            console.log(`Logged in as @${this.user.username}#${this.user.discriminator} - in ${this.guilds.size} guilds`)
        }).on('error', err => {
            console.error('Error in client:')
            console.error(err)
        }).on('messageCreate', this.handleMessage)

        if (options.commandDir) this.addCommandDir(options.commandDir)
    }

    /**
     * Given a message, see if there is a command and process it if so.
     * @param msg - The message object recieved from Eris.
     */
    handleMessage (msg) {
        const [prefix, content] = this.splitPrefixFromContent(msg)
        if (!content) return
        let args = content.split(' ')
        const commandName = args.splice(0, 1)[0]
        const command = this.commandForName(commandName)
        if (!command) return

        command.process(this, msg, args, prefix)
        console.log('did a thing:', commandName, args.join(' '))
    }

    /**
     * Register a command to the client.
     * @param {Command} command - The command to add to the bot.
     */
    addCommand (command) {
        if (!(command instanceof Command)) throw new TypeError('Not a command')
        if (this.commandForName(command.name)) console.error(new Error('Warning: duplicate command found'))
        this.commands.push(command)
        return this
    }

    /**
     * Load all the JS files in a directory and attempt to load them each as
     * commands.
     * @param {string} dirname - The location of the directory.
     * @param {bool} relativeMain - Whether the specified directory is relative
     *     to the main module. Otherwise, the directory is relative to the
     *     module this is executed from. Defaults to true.
     */
    addCommandDir (dirname, relativeMain = true) {
        if (!dirname.endsWith('/')) dirname += '/'
        const pattern = dirname + '*.js'
        const filenames = glob.sync(pattern)
        for (let filename of filenames) {
            try {
                const command = (relativeMain ? require.main : global).require('./' + filename)
                this.addCommand(command)
                console.log('Added command from', filename)
            } catch (e) {
                console.error('Error adding command from', filename)
                console.error(e)
            }
        }
        return this
    }

    /**
     * Checks the list of registered commands and returns one whch is known by a
     * given name, either as the command's name or an alias of the command.
     * @param name {string} - The name of the command to look for.
     * @returns Command|null
     */
    commandForName (name) {
        return this.commands.find(c => [c.name, ...c.aliases].includes(name))
    }

    /**
     * Returns the appropriate prefix string to use for commands based on a
     * certain message.
     * @param msg - The message to check the prefix of.
     * @returns string
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
     * @param msg - The message to process
     * @returns string|null
     **/
    splitPrefixFromContent (msg) {
        // Traditional prefix handling
        const prefix = this.prefixForMessage(msg) // TODO: guild config
        if (msg.content.startsWith(prefix)) {
            return [prefix, msg.content.substr(prefix.length)]
        }
        // Allow mentions to be used as prefixes according to config
        const match = msg.content.match(new RegExp(`^<@!?${this.user.id}>\\s?`))
        if (this.allowMentionPrefix && match) { // TODO: guild config
            return [match[0], msg.content.substr(match[0].length)]
        }
        // Allow no prefix in direct message channels
        if (!msg.channel.guild) {
            return ['', msg.content]
        }
        // we got nothing
        return [null, null]
    }

    /**
     * Creates a message. If the specified message content is longer than 2000
     * characters, splits the message intelligently into chunks until each chunk
     * is less than 2000 characters, then sends each chunk as its own message.
     * Embeds and files are sent with the last message and are otherwise
     * unaffected.
     * @param content
     * @param
     * @TODO
     */
    _createMessageChunked (channelId, content, file, maxLength = 2000) {
        let embed
        if (typeof content === 'object') {
            embed = content.embed
            content = content.content
        } else {
            embed = null
        }
        let self = this
        ~function sendChunk (left) {
            console.log(left.length)
            if (left.length < maxLength) return self.createMessage(channelId, {content, embed}, file)
            let newlineIndex = left.substr(0,maxLength).lastIndexOf('\n')
            if (newlineIndex < 1) newlineIndex = maxLength - 1
            console.log(newlineIndex)
            left = left.split('')
            const chunk = left.splice(0, newlineIndex)
            if (!left.length) {
                // Interesting, the message was exactly good. We'll put the embed and stuff in now.
                return self.createMessage(channelId, {content: chunk, embed: embed}, file)
            }
            sendChunk(left.join(''), maxLength)
        }(content)
    }
}

Yuuko.Command = Command

module.exports = Yuuko
