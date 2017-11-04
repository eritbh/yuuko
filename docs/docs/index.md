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

```bash
$ git clone https://github.com/Geo1088/yuuko mybot
$ cd mybot
$ vi index.js
```

```js
const Yuuko = require('./src/Yuuko')

const mybot = new Yuuko({
    token: 'your_bot_token',  // Token used to auth your bot account
    defaultPrefix: '.'        // Prefix used to trigger commands
})

const pingCommand = new Yuuko.Command('ping', function (msg) {
    msg.channel.createMessage('Pong!')
})

mybot.addCommand(pingCommand).connect()
```

```bash
$ node index.js
# poof
```

For more examples, check out the Examples page.

---

# Class: `Yuuko` <small>extends [`Eris.Client`](https://abal.moe/Eris/docs/Client)</small>

The main client class. Connects to Discord through [Eris](https://npmjs.com/package/eris) and provides command handling.

## Constructor: `new Yuuko(config)`

The initializer is passed a config object which does things.

Name | Type | Description
-----|------|------------
`config` | Object | An object with config options for the bot. All options except `config.token` are optional.

## Properties

Name | Type | Description
-----|------|------------
`defaultPrefix` | String | The default prefix the bot will respond to in guilds for which there is no other confguration.
`commands` | Array<Yuuko.Command> | An array of commands which the bot looks for in messages.

## Methods

### `addCommand(command)` &rsaquo; `Yuuko`

Register a command to the client. Returns the Yuuko instance, so this command is chainable.

Name | Type | Description
-----|------|------------
`command` | Command | The command to add to the bot.

### `addCommandFile` &rsaquo; `Yuuko`

Load a jS file and try to add an exported command. Returns the Yuuko instance, so this command is chainable.

This command uses `require.main.require()` for more intuitive handling of relative paths; however, there are some caveats of this. For more information, see the [NodeJS Documentation on modules.](https://nodejs.org/api/modules.html#modules_accessing_the_main_module) When in doubt, require the built-in `path` module and call this method with `addCommandFile(path.join(__dirname, 'yourFile.js'))`.

Name | Type | Description
-----|------|------------
`filename` | String | The location of the file to load.

### `addCommandDir(dirname)` &rsaquo; `Yuuko`

Load all the JS files in a directory and attempt to load them each as commands. Returns the Yuuko instance, so this command is chainable.

Since this command calls `addCommandFile`, the same caveats with relative paths apply.

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
`msg` | Message | The message to check the prefix of.

### `splitPrefixFromContent(msg)` &rsaquo; `Array&lt;String|null&gt;`

Takes a message, gets the prefix based on the config of any guild it was sent in, and returns an array describing the prefix/content split. The first element of the array is the matched prefix, and the second is the rest of the content of the message. If there is no match, returns `[null, null]`.

Name | Type | Description
-----|------|------------
`msg` | Message | The message to split the prefix from.

---

# Class: `Command`

Another thing.

## Properties

stuff
