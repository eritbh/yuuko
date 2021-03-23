# Yuuko

[![npm version](https://img.shields.io/npm/v/yuuko.svg)](https://www.npmjs.com/package/yuuko)
[![npm@next version](https://img.shields.io/npm/v/yuuko/next)](https://www.npmjs.com/package/yuuko/v/next)
[![Dev dependency status](https://david-dm.org/eritbh/yuuko/dev-status.svg)](https://david-dm.org/eritbh/yuuko?type=dev)
[![Discord support server](https://img.shields.io/discord/409839835503788033?color=7289DA&label=support%20server&logo=discord&logoColor=fff)](https://discord.gg/a2N2YCx)

A zero-dependency Discord command framework for Javascript and Typescript, based on [Eris](https://github.com/abalabahaha/eris). [Read the Documentation.](https://eritbh.me/yuuko)

The goal of this module is to provide a starting point for bots of all sizes. Yuuko provides sane defaults and easily-configurable options for new developers, and is written to be easily extensible for those needing more control.

## Installation

Yuuko expects Eris to be installed as a peer dependency, which allows you to use any forward-compatible Eris version without having to wait for an update to Yuuko. You can install both at once with the following commands:

```bash
$ yarn add --production yuuko eris # yarn
$ npm install --save --production yuuko eris # npm
```

The minimum required Eris version is 0.13.0, though you should use the latest version whenever possible.

### Development builds

All commits to Yuuko are automatically built to a separate branch to make installing development builds from Github easy. If you want to get builds from the `dev` branch, install Yuuko via `github:eritbh/yuuko#builds/dev`. Remember to grab your Eris version of choice as well.

## Usage example

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

For more examples, check the [examples folder](/examples). The [documentation](https://eritbh.me/yuuko) has more information, including a complete API reference.

## LICENSE

[MIT &copy; eritbh](/LICENSE)
