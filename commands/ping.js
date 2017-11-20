const Command = require('../src/Command')

module.exports = new Command('ping', function (msg) {
  msg.channel.createMessage("I'm here.")
}, {
  desc: 'Pings the bot.',
  args: ''
})
