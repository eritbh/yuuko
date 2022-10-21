# Yuuko

[![npm version](https://img.shields.io/npm/v/yuuko.svg)](https://www.npmjs.com/package/yuuko)
[![npm@next version](https://img.shields.io/npm/v/yuuko/next)](https://www.npmjs.com/package/yuuko/v/next)
[![Discord support server](https://img.shields.io/discord/409839835503788033?color=7289DA&label=support%20server&logo=discord&logoColor=fff)](https://discord.gg/a2N2YCx)
[![Donate on Ko-fi](https://img.shields.io/badge/donate-on%20Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/eritbh)

A no-frills Discord command framework for [Eris](https://github.com/abalabahaha/eris).

Yuuko's goal is to provide a solid base for Discord bots of all types and sizes, featuring easy support for modular project structures, multiple levels of configuration hooks, and first-class Typescript compatibility in a lightweight package with no extra dependencies. [Read the usage guide][usage] or [check the full API reference][docs].

> **Note**: Due to slow Eris development and low maintainer responsiveness, Yuuko is currently considered in maintenance mode. It will continue to be updated to work with new versions of Eris, but it will probably not get any significant feature updates - including support for slash commands. The author of this project doesn't recommended the use of Eris-based frameworks, including Yuuko, for new projects at this time.

## Installation

Yuuko expects Eris to be installed as a peer dependency, which allows you to use any forward-compatible Eris version without having to update Yuuko first. Using npm, you can install both at once with this command:

```bash
$ npm install yuuko eris
```

Generally, the latest version of Eris is the only one actively tested against. You can try older versions, but there's no guarantee they'll work - Yuuko is often updated to take advantage of the latest changes to Eris.

## Usage example

```js
const {Client, Command} = require('yuuko');

const mybot = new Client({
  // Token used to auth your bot account
  token: 'your_bot_token',
  // Prefix used to trigger commands
  prefix: '.',
});

const pingCommand = new Command('ping', message => {
  message.channel.createMessage('Pong!');
});

mybot
  .addCommand(pingCommand)
  .connect();
```

This is all you need to get up and running! Read the [usage guide][usage] for a walkthrough of Yuuko's most notable features, or check the [full API reference][docs].

## Development builds

All commits to Yuuko's development branches are automatically built via CI to make installing development versions from Github easy. For example, if you want to get builds from the branch `my-new-feature`, install Yuuko as `eritbh/yuuko#builds/my-new-feature`. Remember to grab your Eris version of choice as well.

## LICENSE

[MIT &copy; eritbh](/LICENSE)

[usage]: https://eritbh.me/yuuko/usage
[docs]: https://eritbh.me/yuuko/docs
