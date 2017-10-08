const Command = require('../src/Command')
const moment = require('moment-timezone')
const childProcess = require('child_process')
const packageJson = require.main.require('./package.json')

module.exports = new Command(['about', 'uptime', 'info'], (c, msg, args, prefix) => {
  const uptimeDuration = moment.duration(c.uptime).humanize()
  const uptimeStart = moment().subtract(c.uptime).tz('America/New_York').format('YYYY-DD-mm kk:mm z')
  const link = packageJson.homepage
  childProcess.exec('git describe --abbrev=0 --tags', (err, tag) => {
    if (err) {
      tag = '???'
      console.log(err)
    } else {
      tag = '`' + tag.replace('\n', '') + '`'
    }
    childProcess.exec('git rev-parse --short HEAD', (err, sha) => {
      if (err) {
        sha = 'Unknown'
        console.log(err)
      } else {
        sha = '`' + sha.replace('\n', '') + '`'
      }
      msg.channel.createMessage(`**=== About Yuuko ===**
*(Use \`${prefix}help\` to get help using the bot!)*
**Project:** ${link}
**Version:** ${tag} (Commit: ${sha})
**Uptime:** ${uptimeDuration} (since ${uptimeStart})
Please report any bugs or feedback by creating an issue on the repository.`)
    })
  })
}, {
  desc: 'Displays information about the bot, including running version and time since last crash.',
  args: ''
})
