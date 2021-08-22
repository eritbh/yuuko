---
layout: md
title: Usage Examples
group: nav
order: 1
permalink: /usage/
header: ["Using Yuuko", "A quick start and overview of how to use Yuuko's features"]
---
# Prerequisites and installation

Yuuko will use whatever version of Eris you install alongside it. This allows you to use pretty much whatever version of Eris you want, though sticking with the latest release or an actively-developed dev build is recommended. You can install `yuuko` and `eris` together with one command:

```bash
npm install yuuko eris
```

# The bare minimum

This code will get you a basic call-response bot up and running. Fill in your token, set it running, and send "!ping" in a channel you share with it. It'll respond "Pong!" as any good bot should.

```js
const {Client, Command} = require('yuuko');

const mybot = new Client({
  token: 'feed_me_credentials',
  prefix: '!',
});

const pingCommand = new Command('ping', message => {
  message.channel.createMessage('Pong!');
});

mybot.addCommand(pingCommand).connect();
```
```ts
import {Client, Command} from 'yuuko';

const mybot = new Client({
  token: 'feed_me_credentials',
  prefix: '!',
});

const pingCommand = new Command('ping', message => {
  message.channel.createMessage('Pong!');
});

mybot.addCommand(pingCommand).connect();
```

# Splitting off your commands

When you have lots of commands, it becomes impractical to store them all in one file. Luckily, Yuuko makes it easy to work with commands stored in other files. Here's an example:

```js
// index.js
const {Client} = require('yuuko');
const mybot = new Client({
  token: 'feed_me_credentials',
  prefix: '!',
});
mybot
  .addDir(path.join(__dirname, 'commands'))
  .connect();

// commands/ping.js
const {Command} = require('yuuko');
module.exports = new Command('ping', message => {
  message.channel.createMessage('Pong!');
});
```
```ts
// index.js
import {Client} from 'yuuko';
const mybot = new Client({
  token: 'feed_me_credentials',
  prefix: '!',
});
mybot
  .addDir(path.join(__dirname, 'commands'))
  .connect();

// commands/ping.js
import {Command} from 'yuuko';
export default new Command('ping', message => {
  message.channel.createMessage('Pong!');
});
```

# Command arguments

The function run when a command is executed takes a second parameter which contains an array of space-separated arguments to the command. You can use it like so:

```js
const addCommand = new Command('add', (message, args) => {
  // Convert the arguments to numbers
  args = args.map(number => parseInt(number, 10));
  // Add them all up!
  let sum = 0;
  for (const number of args) {
    sum += number;
  }
  msg.channel.createMessage(`The sum is ${sum}!`);
});
```
```ts
const addCommand = new Command('add', (message, args) => {
  // Convert the arguments to numbers
  args = args.map(number => parseInt(number, 10));
  // Add them all up!
  let sum = 0;
  for (const number of args) {
    sum += number;
  }
  msg.channel.createMessage(`The sum is ${sum}!`);
});
```

# The context argument

Additionally, commands take a third parameter, a *context object*. By default, this object contains the name of the command being called and a reference to the client object, but you can add custom properties to it through `Client#extendContext()` to easily share objects (database connections, etc.) among all your files.

```js
// index.js
const {Client} = require('yuuko');
const mybot = new Client({...});
mybot.extendContext({
  myCustomThing: 'This is neat!',
});
mybot.addDir(path.join(__dirname, 'commands')).run();

// commands/test.js
const {Command} = require('yuuko');
module.exports = new Command('test', (message, args, context) => {
  context.client // The same as mybot in the first file
  context.commandName // The name or alias used to call the command
  context.myCustomThing // The string 'This is neat!' that was set above
});
```
```ts
// index.ts
import {Client} from 'yuuko';
const mybot = new Client({...});
mybot.extendContext({
  myCustomThing: 'This is neat!',
});
mybot.addDir(path.join(__dirname, 'commands')).run();

// commands/test.ts
import {Command} from 'yuuko';
export default new Command('test', (message, args, context) => {
  context.client // The same as mybot in the first file
  context.commandName // The name or alias used to call the command
  context.myCustomThing // The string 'This is neat!' that was set above
});
```

# Subcommands

Subcommands allow you to create structure and heirarchy in your commands, grouping related features together under a parent command in an intuitive way. Subcommands inherit the requirements of the parent command, but can also include their own requirements. The context object's `commandName` property will also include parent command names, so you can know exactly how the command was called.

```js
// commands/test.js
const {Command} = require('yuuko');

module.exports = new Command('foo', (message, args, context) => {
  message.channel.createMessage('Foo!');
  context.commandName // The string 'foo'
}, {
  guildOnly: true,
})
  .addSubcommand(new Command('bar', (message, args, context => {
    message.channel.createMessage('Bar!');
    context.commandName 
  }, {
    owner: true,
  })));
```
```ts
// commands/test.js
import {Command} from 'yuuko';

export default new Command('test', (message, args, context) => {
  message.channel.createMessage('Test!');
  context.commandName // The string 'foo'
}, {
  guildOnly: true,
})
  .addSubcommand(new Command('something', (message, args, context) => {
    message.channel.createMessage('Secret command!');
    context.commandName 
  }, {
    owner: true,
  }));
```

With the command shown in this example, users of your bot can use the `.test` command as long as they're in a server, and only you can use the `.test something` command in server. Nesting subcommands is supported, and commands will receive arguments starting with the first word of the message that doesn't name a subcommand.

# Custom prefixes

You can set a function that's used to set a custom prefix on a per-message basis. This can be used to set per-guild prefixes. This function also receives a context object (minus the `prefix` and `commandName` properties) as its second argument.

```js
mybot.prefixes(message => {
  // If we're not in a guild, just use the default
  if (!message.channel.guild) return;
  // In guilds, allow two prefixes, "!" and "!!"
  return ['! ', '!!'];
});
```
```ts
mybot.prefixes(message => {
  // If we're not in a guild, just use the default
  if (!message.channel instanceof Eris.GuildChannel) return;
  // In guilds, allow two prefixes, "!" and "!!"
  return ['! ', '!!'];
});
```

# Listening on events

Yuuko also includes an `EventListener` class, which you can use to split up your event logic with a similar interface to commands. The handler you provide will receive a Yuuko context object, including all your additions (but without the `prefix` and `commandName` entries used with commands).

```js
const {EventListener} = require('yuuko');
module.exports = new EventListener('messageCreate', (message, context) => {
  // Reference properties of the client directly while handling an event
  console.log(message.author.id === context.client.user.id);
});
```
```ts
import {EventListener} from 'yuuko';
export default new EventListener('messageCreate', (message, context) => {
  // Reference properties of the client directly while handling an event
  console.log(message.author.id === context.client.user.id);
});
```

These listeners can be loaded similarly to commands - they'll be picked up by the `addFile` and `addDir` methods automatically, and you can also use `addEvent` the same way as `addCommand` if you need to load an instance directly.

# Everything Eris

Yuuko's client class extends Eris's, so you can use all the client methods directly.

```js
mybot.once('ready', () => {
  console.log('Ready! Logged in as', mybot.user.username);
})
```
```ts
mybot.once('ready', () => {
  console.log('Ready! Logged in as', mybot.user.username);
})
```

# More information

For more info about the methods you can use with Yuuko, check out the [full API documentation](/yuuko/docs).

<button id="language-toggle" onclick="toggleLanguage()">Show Typescript examples</button>
<style>
#language-toggle {
  position: fixed;
  bottom: 5px;
  right: 5px;
  padding: 10px;
  background: #3cc76d;
  color: white;
  border: 0;
  border-radius: 5px;
  text-shadow: 0 1px rgba(0,0,0,0.2);
  font-size: 1.6rem;
}
</style>
<script>
let ts = true;
function toggleLanguage () {
  ts = !ts;
  document.getElementById('language-toggle').textContent = ts ? 'Show Javascript examples' : 'Show Typescript examples';
  document.querySelectorAll('.language-js').forEach(element => {
    element.style.display = ts ? 'none' : 'block';
  });
  document.querySelectorAll('.language-ts').forEach(element => {
    element.style.display = ts ? 'block' : 'none';
  });
}
toggleLanguage();
</script>
