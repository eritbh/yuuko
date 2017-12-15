const Command = require('../src/Command')

module.exports = new Command('ping', function (msg) {
  msg.channel.createMessage("I'm here.")
})
module.exports.help = {
  desc: 'Pings the bot.',
  args: ''
}
