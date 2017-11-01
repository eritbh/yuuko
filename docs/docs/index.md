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

## Properties

Name | Type | Description
:---:|:----:|:-----------
**`defaultPrefix`** | String | The default prefix the bot will respond to in guilds for which there is no other confguration.
**`commands`** | Array<Yuuko.Command> | An array of commands which the bot looks for in messages.

## Methods

### `addCommand(command)`

Register a command to the client.

Name | Type | Description
:---:|:----:|:-----------
`command` | Command | The command to add to the bot.

### `addCommandDir(dirname)`

Load all the JS files in a directory and attempt to load them each as commands.

Name | Type | Description
:---:|:----:|:-----------
`dirname` | String | The location of the directory.
`relativeMain` | Boolean? | Whether the specified directory is relative to the main module. Otherwise, the directory is relative to the module this is executed from. Defaults to `true`.

### `commandForName(name)` &rsaquo; Command

Checks the list of registered commands and returns one whch is known by a given name, either as the command's name or an alias of the command.

Name | Type | Description
:---:|:----:|:-----------
`name` | String | The name of the command to look for.
Return value | Command\|null | The matching command, or `null` if there is none.

---

# Class: `Command`

Another thing.

## Properties

stuff
