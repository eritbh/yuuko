# Yuuko

[![npm module](https://img.shields.io/npm/v/yuuko.svg)](https://www.npmjs.com/package/yuuko)
[![Discord support server](https://img.shields.io/discord/409839835503788033?color=7289DA&label=support%20server&logo=discord&logoColor=fff)](https://discord.gg/a2N2YCx)
[![Dependency status](https://img.shields.io/david/Geo1088/yuuko.svg)](https://david-dm.org/geo1088/yuuko)
[![Dev dependency status](https://david-dm.org/geo1088/yuuko/dev-status.svg)](https://david-dm.org/geo1088/yuuko?type=dev)
[![Patreon contributions](https://img.shields.io/endpoint.svg?logo=none&label=fund%20on%20Patreon&url=https://shieldsio-patreon.herokuapp.com/geo1088/pledges)](https://www.patreon.com/geo1088)

A Discord command framework for Javascript and Typescript. An extension of [Eris](https://github.com/abalabahaha/eris) and alternative to the built-in CommandClient. [Documentation](http://geo1088.me/yuuko)

The goal of this module is to provide a starting point for bots of all sizes. Yuuko provides sane defaults and easily-configurable options for new developers, but also builds in extensibility for those needing more control.

### Installation

Yuuko expects Eris to be installed as a peer dependency, which allows you to use any forward-compatible Eris version without having to wait for an update to Yuuko. You can install both at once with the following commands:

```bash
$ yarn add yuuko eris # yarn
$ npm install --save yuuko eris # npm
```

### Ping-pong example

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

For more examples, check the [examples folder](/examples). The [documentation](http://geo1088.me/yuuko) has more information, including a complete API reference.
