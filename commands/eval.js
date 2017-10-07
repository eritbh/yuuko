const Command = require('../src/Command')

module.exports = new Command('eval', (c, msg, args) => {
    c.getOAuthApplication().then(app => {
        if (app.owner.id !== msg.author.id) {
            return msg.channel.createMessage("You're not my dad.")
        }

        args = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '')
        if (args.startsWith('```') && args.endsWith('```')) {
            args = args.substring(3, args.length - 3)
            if (args.startsWith('js')) {
                args = args.substr(2)
            }
        }
        const result = c.eval(args)
        msg.channel.createMessage(result).catch(err => {
            msg.channel.createMessage('Error sending message:\n```\n' + err + '\n```')
        })
    }).catch(e => {
        console.log(e)
    })
})
