const Command = require('../src/Command')

module.exports = new Command(['help', 'h'], function (msg, args) {
  const prefix = this.prefixForMessage(msg)

  // If we got nothing, command list
  if (!args[0]) {
    const commandList = this.commands.map(c => '`' + prefix + c.name + '`').join(', ')
    return msg.channel.createMessage(`**=== Help: Command List ===**
You can use the following commands: ${commandList}
Use \`${prefix}help [command]\` to get more info on that command!`)
  }

  // We got a command, let's try using it
  let command = this.commandForName(args[0])
  if (command) return msg.channel.createMessage(`**=== Help: \`${prefix + command.name}\` ===**\n${command.helpText(prefix)}`)

  // Rip, error
  msg.channel.createMessage(`**=== Help: Unknown Command ===**
Make sure you spelled the command name right, and that this bot has it. Do \`${prefix}help\` with no arguments to see a list of commands.`)
}, {
  desc: 'Get a list of commands. Pass a command name as an argument to get information about that command.',
  args: '[command]'
})
