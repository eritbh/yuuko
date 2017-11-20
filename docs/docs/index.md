---
layout: docs
group: nav
title: API Docs
order: 3
---
# Welcome!

This is the documentation for Yuuko. If you want to create your own bot based on Yuuko's code, you're in the right place!

---

# Quick Start

Install:

```
$ npm install --save yuuko
```

Use:

```js
const Yuuko = require('yuuko')

const mybot = new Yuuko({
  token: 'your_bot_token',  // Token used to auth your bot account
  defaultPrefix: '.'        // Prefix used to trigger commands
})

const pingCommand = new Yuuko.Command('ping', function (msg) {
  msg.channel.createMessage('Pong!')
})

mybot.addCommand(pingCommand).connect()
```

Run:

```
$ node index.js
Logged in as @MyBot#1234 - in 2 guilds
```

And just like that, you're up and running! To test the bot, add the bot to a server and say `.ping` to it.

For more examples, check out the Examples page.

---

# Class: `Yuuko` <small>extends [`Eris.Client`](https://abal.moe/Eris/docs/Client)</small>

The main client class. Connects to Discord through [Eris](https://npmjs.com/package/eris) and provides command handling.

## Constructor: `new Yuuko(config)`

The initializer is passed a config object which does things.

Name | Type | Description
-----|------|------------
`config` | Object | An object with config options for the bot. All options except `config.token` are optional.
`config.token` | String |
`config.commandDir` | String |
`config.defaultPrefix` | String |
`config.allowMention` | Boolean |

<!-- TODO: Document custom fields -->

## Properties

Name | Type | Description
-----|------|------------
`defaultPrefix` | String | The default prefix the bot will respond to in guilds for which there is no other confguration.
`commands` | Array<Yuuko.Command> | An array of commands which the bot looks for in messages.
`allowMention` | Boolean | Whether or not the bot can respond to messages starting with a mention of the bot.

## Methods

### `addCommand(command)` &rsaquo; `Yuuko`

Register a command to the client. Returns the Yuuko instance, so this command is chainable.

Name | Type | Description
-----|------|------------
`command` | Command | The command to add to the bot.

### `addCommandFile` &rsaquo; `Yuuko`

Load a JS file and try to add an exported command. Returns the Yuuko instance, so this command is chainable.

This method does not accept relative paths. `require('path')` and use `addCommandFile(path.join(__dirname, 'yourFile.js'))` instead.

Name | Type | Description
-----|------|------------
`filename` | String | The location of the file to load.

### `addCommandDir(dirname)` &rsaquo; `Yuuko`

Load all the JS files in a directory and attempt to load them each as commands. Returns the Yuuko instance, so this command is chainable.

This method does not accept relative paths. `require('path')` and use `addCommandFile(path.join(__dirname, 'yourFile.js'))` instead.

Name | Type | Description
-----|------|------------
`dirname` | String | The location of the directory to load.

### `commandForName(name)` &rsaquo; `Command`

Checks the list of registered commands and returns one whch is known by a given name, either as the command's name or an alias of the command. If no match is found, returns `null`.

Name | Type | Description
-----|------|------------
`name` | String | The name of the command to look for.

### `prefixForMessage(msg)` &rsaquo; `String`

Returns the appropriate prefix string to use for commands based on a certain message.

Name | Type | Description
-----|------|------------
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message to check the prefix of.

### `splitPrefixFromContent(msg)` &rsaquo; `Array<String|null>`

Takes a message, gets the prefix based on the config of any guild it was sent in, and returns an array describing the prefix/content split. The first element of the array is the matched prefix, and the second is the rest of the content of the message. If there is no match, returns `[null, null]`.

Name | Type | Description
-----|------|------------
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message to split the prefix from.

---

# Class: `Command`

A command that can be executed by users of the bot.

## Constructor: `new Command(name, process, help)`

Creates a command. Note that a command must be registered to the Yuuko instance with `addCommand()` or another related method before being available to users of your bot.

Name | Type | Description
-----|------|------------
`name` | String&#124;Array | The name of the command. Command names are case-insensitive. If a string is passed, that string simply becomes the command's name; if an array is passed, the first element becomes the command's name and the rest become aliases.
`process` | Function | See below.
`help` | Object | Optional; default: `{}`. Extra information stored with the command, used by the `helpText()` method.
`help.desc` | String | A description of the command.
`help.args` | String | A formatted overview of arguments the command accepts.

### Command Process

A function which is executed each time this command is triggered. The value of `this` inside the function is a reference to the Yuuko instance which picked up the command. Nothing is done with anything the function returns, and it takes up to 3 arguments:

Name | Type | Description
-----|------|------------
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message that triggered the command.
`args` | Array<String> | An array of arguments passed to the command, obtained by removing the command name and prefix from the message, then splitting on spaces. To get the raw text that was passed to the command, use `args.join(' ')`.
`prefix` | String | The prefix used in the message.

## Properties

Name | Type | Description
`name` | String | The name of the command.
`aliases` | Array<String> | An array of aliases, or alternate names, the command can be called by.
`names` | Array<String> | An array of names the command can be called by. Contains the command's name as the first item, and any aliases of the command as subsequent items.
`process` | Function | See above.
`help` | Object | See the description of `help` in the constructor.

## Methods

### `helpText(prefix)` &rsaquo; `String`

Returns a string that is used as a help message for the command based on the command's `help` property.

Name | Type | Description
-----|------|------------
`prefix` | String | Optional; default: `''`. The prefix to use for usage examples in the generated message.
