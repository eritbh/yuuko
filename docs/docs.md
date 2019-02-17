---
layout: docs
group: nav
title: API Docs
order: 3
---
<aside class="toc" markdown="1">

- [Quick Start](#quick-start)
- [Class: `Client`](#class-client-extends-erisclient)
  - [`new Client(config)`](#constructor-new-clientconfig)
  - [Properties](#properties)
  - [Event: `ready`](#ready)
  - [Event: `commandLoaded`](#commandloaded)
  - [Event: `preCommand`](#precommand)
  - [Event: `command`](#command)
  - [`addCommand(command)`](#addcommandcommand--client)
  - [`addCommandFile(filename)`](#addcommandfile--client)
  - [`addCommandDir(dirname)`](#addcommanddirdirname--client)
  - [`reloadCommands()`](#reloadcommands--client)
  - [`commandForName(name)`](#commandfornamename--commandnull)
  - [`prefixForMessage(msg)`](#prefixformessagemsg--string)
  - [`splitPrefixFromContent(msg)`](#splitprefixfromcontentmsg--arraystringnull)
- [Class: `Command`](#class-command)
  - [`new Command(name, process, requirements)`](#constructor-new-commandname-process-requirements)
  - [Process function](#process-function)
  - [Custom requirement function](#custom-requirement-function)
  - [Properties](#properties-1)
  - [`checkPermissions(client, msg)`](#checkpermissionsclient-msg)
  - [`execute(client, msg, args, prefix, commandName)`](#executeclient-msg-args-prefix-commandname)

</aside>
<main markdown="1">

# Welcome!

This is the documentation for Yuuko. If you want to create your own bot based on Yuuko's code, you're in the right place!

---

# Quick Start

## Installation

```bash
$ yarn add yuuko # yarn
$ npm install --save yuuko # npm
```

## Usage

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

## Run

```bash
$ node index.js
```

And just like that, you're up and running! To test the bot, add the bot to a server and say `.ping` to it.

For more examples, check out the Examples page.

---

# Class: `Client` extends [`Eris.Client`](https://abal.moe/Eris/docs/Client)

The main client class. Connects to Discord through [Eris](https://npmjs.com/package/eris) and provides command handling. Accessible via `require('yuuko')` or `require('yuuko').Client`. Unless otherwise noted, all properties, events, and methods are carried over from the Eris client.

## Constructor: `new Client(config)`

The initializer is passed a config object which does things.

Name | Type | Description
-----|------|------------
`config` | Object | An object with config options for the bot. In addition to these document fields, this object will be passed to the Eris constructor as the `options` object, so this can also contain any fields documented for the [Eris constructor](https://abal.moe/Eris/docs/Client) `options` parameter.
`config.token` | String | The token used to log into the bot.
`config.prefix` | String | Optional. A string messages must be prefixed with in order to be recognized as commands. You can set this to an empty string to respond to all messages without a prefix, but this is **highly discouraged**. Note that commands sent as direct messages do not require a prefix.
`config.allowMention` | Boolean | Optional, default `true`. Whether or not the bot can respond to messages starting with a mention of the bot. If this is `false`, and `config.prefix` is omitted, there will be no way to interact with the bot in guilds.
`config.ignoreBots` | Boolean | Optional, default `true`. Whether or not the bot should ignore messages from other bots. Prevents malicious bots from starting feedback loops and other mischief.

## Properties

Name | Type | Description
-----|------|------------
`prefix` | String | The default prefix the bot will respond to in guilds for which there is no other confguration. (Currently all of them)
`commands` | Array&lt;Command&gt; | An array of commands which the bot looks for in messages.
`allowMention` | Boolean | Whether or not the bot can respond to messages starting with a mention of the bot.
`mentionPrefixRegExp` | RegExp&#124;`null` | The RegExp used to tell whether or not a message starts with a mention of the bot. Only present after the 'ready' event.
`app` | Object&#124;`null` | The OAuth application information returned by Discord. Only present after the 'ready' event.

## Events

### `ready`

Overridden from the [Eris `ready` event](https://abal.moe/Eris/docs/Client#event-ready). Functionally the same, but only emitted after internal setup of the `app` and `prefixMentionRegExp` properties.

This event recieves no arguments.

### `commandLoaded`

Emitted when a command is loaded.

Name | Type | Description
-----|------|------------
command | Command | The command that was loaded.

### `preCommand`

Emitted before a command will be executed.

Name | Type | Description
-----|------|------------
command | Command | The command to be run.
msg | Message | The message that triggered the command.

### `command`

Emitted after a command has been executed.

Name | Type | Description
-----|------|------------
command | Command | The command that was run.
msg | Message | The message that triggered the command.

## Methods

### `addCommand(command)` &rsaquo; `Client`

Register a command to the client. Returns the client instance, so this command is chainable.

Name | Type | Description
-----|------|------------
`command` | Command | The command to add to the bot.

### `addCommandFile(filename)` &rsaquo; `Client`

Load a JS file and try to add an exported command. Returns the client instance, so this command is chainable.

This method does not accept relative paths. `require('path')` and use `addCommandFile(path.join(__dirname, 'yourFile.js'))` instead.

Name | Type | Description
-----|------|------------
`filename` | String | The location of the file to load.

### `addCommandDir(dirname)` &rsaquo; `Client`

Load all the JS files in a directory and attempt to load them each as commands. Returns the client instance, so this command is chainable.

This method does not accept relative paths. `require('path')` and use `addCommandFile(path.join(__dirname, 'yourFile.js'))` instead.

Name | Type | Description
-----|------|------------
`dirname` | String | The location of the directory to load.

### `reloadCommands()` &rsaquo; `Client`

Reloads all commands that were loaded via `addCommandFile` and `addCommandDir`. Useful for development to hot-reload commands as you work on them. Returns the client instance, so this command is chainable.

### `commandForName(name)` &rsaquo; `Command|null`

Checks the list of registered commands and returns one which is known by a given name, either as the command's name or an alias of the command. If no match is found, returns `null`.

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

A command that can be executed by users of the bot. Accessible via `require('yuuko').Command`.

## Constructor: `new Command(name, process, requirements)`

Creates a command. Note that a command must be registered to the client instance with `addCommand()` or another related method before being available to users of your bot.

Name | Type | Description
-----|------|------------
`name` | String&#124;Array | The name of the command. Command names are case-insensitive. If a string is passed, that string simply becomes the command's name; if an array is passed, the first element becomes the command's name and the rest become aliases.
`process` | Function | See below.
`requirements` | Object? | An object of requirements that must be met for a user to be allowed to run the command. If omitted, all users will be able to run it.
`requirements.owner` | Boolean? | If `true`, only the owner of the bot's OAuth application can use the command.
`requirements.permissions` | String&#124;Array&lt;String&gt;? | A permission name or array of permission names that the user running the command must have. If specifying a list, the user must have *all* of the permissions listed.
`requirements.custom` | Function&#124;Array&lt;Function&gt;? | A function or array of functions whose return values determine whether or not the command can be run. If every function specified here returns `true` (or any truthy value), the user can run the command.

## Process function

A function which is executed each time this command is triggered. The value of `this` inside the function is a reference to the client instance which picked up the command. Nothing is done with anything the function returns, and it takes up to 3 arguments:

Name | Type | Description
-----|------|------------
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message that triggered the command.
`args` | Array&lt;String&gt; | An array of arguments passed to the command, obtained by removing the command name and prefix from the message, then splitting on spaces. To get the raw text that was passed to the command, use `args.join(' ')`.
`prefix` | String | The prefix used in the message.
`commandName` | String | The name or alias used to call the command in the message. Will be one of the values of `this.names`.

## Custom requirement function

A function that returns `true` if the given message should trigger the command, and `false` if it should not.

Name | Type | Description
-----|------|------------
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message that triggered the check.
`client` | Client | The client instance that recieved the message triggering the check.

## Properties

Name | Type | Description
-----|------|------------
`name` | String | The name of the command.
`aliases` | Array&lt;String&gt; | An array of aliases, or alternate names, the command can be called by.
`names` | Array&lt;String&gt; | An array of names the command can be called by. Contains the command's name as the first item, and any aliases of the command as subsequent items.
`process` | Function | See above.
`requirements` | Object | An object of requirements that must be met for a user to be allowed to run the command.

## Methods

### `checkPermissions(client, msg)` &raquo; `Promise<Boolean>`

Checks whether or not a command can be executed based on the command's requirements (set in the constructor's `requirements` argument).

Name | Type | Description
-----|------|------------
`client` | Client | The client instance that recieved the message triggering the check.
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message that triggered the check.

### `execute(client, msg, args, prefix, commandName)`

Executes the command process if the permission checks pass.

Name | Type | Description
-----|------|------------
`client` | Client | The client instance that recieved the message triggering the command.
`msg` | [Message Object](https://abal.moe/Eris/docs/Message) | The message that triggered the command.
`args` | Array&lt;String&gt; | An array of arguments passed to the command, obtained by removing the command name and prefix from the message, then splitting on spaces. To get the raw text that was passed to the command, use `args.join(' ')`.
`prefix` | String | The prefix used in the message.
`commandName` | String | The name or alias used to call the command in the message. Will be one of the values of `this.names`.

---

<small>Docs generated [by hand](https://github.com/Geo1088/yuuko/blob/master/docs/docs/index.md) because I'm an idiot.</small>

</main>
