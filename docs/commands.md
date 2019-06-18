---
layout: md
title: Commands
group: nav
order: 2
permalink: /commands/
header: ["Command List"]
---

# Commands

Yuuko comes with some commands built-in to make your life easier when building and your bot. They can be used like so:

```js
const debug = require('yuuko/dist/commands/debug');
mybot.addCommand(debugCommand);
```

## `debug`

Evaluates Javascript. Lets you manually inspect properties of the client, awaits promises, and also mocks out the `console` so you can perform `console.log`s and have them displayed in Discord.

## `help`

A default help command. Add a `help` property to your command like so:

```js
const someCommand = new Command(...);
someCommand.help = {
	desc: 'Does some things',
	args: '<anything that you pass to the command>',
};
```
This default help command will pick up the help information from that property and automatically show it when people do `~help <commandname>`.

## `reload`

Reloads any commands that were loaded from files. Useful if you need to test a new change to a command without restarting the whole bot.

## `setavatar`

Sets the bot user's avatar. Feed the command an image URL or upload an attachment with your message.

## `setname`

Sets the bot user's username. Send the new username as the only argument to the command.

## `setstatus`

Sets the bot user's status. To change the bot's status icon, pass `online`, `offline`, `idle`, or `dnd`. To change the bot's status text, pass the new text. You can also pass both at once - put the icon name first.
