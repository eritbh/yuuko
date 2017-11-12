# Yuuko [![npm](https://img.shields.io/npm/v/yuuko.svg)](https://www.npmjs.com/package/yuuko) [![dependencies](https://img.shields.io/david/Geo1088/yuuko.svg)](https://david-dm.org/geo1088/yuuko) [![Code Climate](https://img.shields.io/codeclimate/github/geo1088/Yuuko.svg)](https://codeclimate.com/github/geo1088/Yuuko)

A Discord bot in Node that focuses on getting and manipulating information useful to developers and designers.

## Using the bot

Usage information for the bot (the usable commands, default configuration, and other help topics) can be found [here](https://geo1088.github.io/yuuko).

## Using the package

Yuuko's core is available as [a module on npm](https://www.npmjs.com/package/yuuko). It extends [Eris](https://github.com/abalabahaha/eris) and is basically an alternative to its CommandClient class.

```bash
$ npm i yuuko
```

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

```bash
$ node mybot.js
Logged in as @MyBot#1234 - in 2 guilds
```

For more information, see the [API Docs](http://geo1088.github.io/yuuko/docs/).
