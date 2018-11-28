# [Yuuko](https://geo1088.github.io/yuuko) [![npm module](https://img.shields.io/npm/v/yuuko.svg)](https://www.npmjs.com/package/yuuko) [![Discord support server](https://hook.io/geo1088/discord-badge/409839835503788033?left=support%20server)](https://discord.gg/a2N2YCx) [![Dependency status](https://img.shields.io/david/Geo1088/yuuko.svg)](https://david-dm.org/geo1088/yuuko) [![Dev dependency status](https://david-dm.org/geo1088/yuuko/dev-status.svg)](https://david-dm.org/geo1088/yuuko?type=dev) [![Maintainability](https://img.shields.io/codeclimate/maintainability/Geo1088/yuuko.svg)](https://codeclimate.com/github/Geo1088/yuuko/maintainability)

A Discord bot in Node that focuses on getting and manipulating information useful to developers and designers.

## Using the bot

Usage information for the bot (the usable commands, default configuration, and other help topics) can be found [here](https://geo1088.github.io/yuuko).

## Using the package

Yuuko's core is available as [a module on npm](https://www.npmjs.com/package/yuuko). It extends [Eris](https://github.com/abalabahaha/eris) and is basically an alternative to its CommandClient class.

The goal of this module is to provide me a base I can use to make basic, single-server bots. As a result, it doesn't include any faculties for things like per-guild prefixes or configuration.

### Installation

```bash
$ yarn add yuuko # yarn
$ npm install --save yuuko # npm
```

### Usage

```js
const {Client, Command} = require('yuuko');

const mybot = new Client({
  token: 'your_bot_token',  // Token used to auth your bot account
  prefix: '.'               // Prefix used to trigger commands
});

const pingCommand = new Command('ping', function (msg) {
  msg.channel.createMessage('Pong!')
});

mybot.addCommand(pingCommand).connect();
```

```bash
$ node index.js
```

For more information, see the [API Docs](http://geo1088.github.io/yuuko/docs/).
