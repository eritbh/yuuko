const Command = require('../src/Command')
const moment = require('moment-timezone')

module.exports = new Command('uptime', (c, msg) => {
    msg.channel.createMessage(`I've been crash-free for ${
        moment.duration(c.uptime).humanize()
    }, since ${
        moment().subtract(c.uptime).tz('America/New_York').format('MMMM D [at] k:mm z')
    }.`)
}, {
    desc: 'Displays how long the bot has been alive for.',
    args: ''
})
