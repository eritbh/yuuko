---
layout: docs
group: nav
title: API Docs
order: 3
---
# Welcome!

This is the documentation for Yuuko. It's fun.

## Example

```js
const Yuuko = require('./src/Yuuko')   // TODO: this isn't a real module

const mybot = new Yuuko({
    token: 'your_bot_token',     // Token used to auth your bot account
    defaultPrefix: '.'           // Prefix used to trigger commands
})

const pingCommand = new Yuuko.Command('ping', function (msg) {
    msg.channel.createMessage('Pong!')
})

mybot.addCommand(pingCommand).connect()
```

## Class: `Yuuko`

The main client class. Yuuko inherits from [Eris](https://npmjs.com/package/eris), so any [Eris-provided methods and properties](https://abal.moe/Eris/docs/Client) for interacting with the client will work if called on a Yuuko instance as well.

### Constructor: `new Yuuko(config)`

The initializer is passed a config object which does things.

### Properties

Name | Type | Description
:---:|:----:|:-----------
**`defaultPrefix`** | String | The default prefix the bot will respond to in guilds for which there is no other confguration.
**`commands`** | Array<Yuuko.Command> | An array of commands which the bot looks for in messages.

### Methods

#### `someMethod(arg)`

## Class: `Yuuko.Command`

Another thing.

### Properties

stuff
