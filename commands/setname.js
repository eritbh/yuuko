const Command = require('../src/Command')

module.exports = new Command('setname', (c, msg, args) => {
    c.getOAuthApplication().then(app => {
        if (app.owner.id !== msg.author.id) {
            return msg.channel.createMessage("You're not my dad.")
        }
        c.editSelf({username: args.join(' ')}).then(() => {
            msg.channel.createMessage('Username updated!')
        }).catch(e => {
            msg.channel.createMessage('There was an error while changing username.\n```\n' + e.message + '\n```')
        })
    })
})
