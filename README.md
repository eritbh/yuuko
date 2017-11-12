# Yuuko

A simple Discord bot base that extends [Eris](https://github.com/abalabahaha/eris) and basically amounts to a different version of `Eris.CommandClient`.

## Quick-Start

```
npm i yuuko
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

```
$ node mybot.js
Logged in as @MyBot#1234 - in 2 guilds
```

For more information, see the [API Docs](http://geo1088.github.io/yuuko/docs/).


