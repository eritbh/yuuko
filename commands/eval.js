const Command = require('../src/Command')
const util = require('util')

module.exports = new Command('eval', function (msg, args, prefix, commandName) {
  this.getOAuthApplication().then(app => {
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

    // Do some weird shit here because why not
    let og = console.log
    let response
    let ___console = '' // trying really hard to make this not noticeable
    args = `console.log = function (...args) {
      ___console += args.join(' ') + '\\n'
    };` + args
    try {
      response = eval(args) // eslint-disable-line no-eval
    } catch (e) {
      response = e
    }
    console.log = og
    ___console = ___console.split(/\n/g).map(line => line ? '//> ' + line : '').join('\n').replace(/\n+$/, '')
    const result = '```js\n' + ___console + ((___console && response === undefined) ? '' : util.inspect(response)) + '\n```'

    msg.channel.createMessage(result).catch(err => {
      msg.channel.createMessage('Error sending message:\n```\n' + err + '\n```')
    })
  }).catch(e => {
    console.log(e)
  })
})
