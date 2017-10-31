---
layout: docs
group: nav
title: API Docs
order: 3
---
# Welcome!

This is the documentation for Yuuko. It's fun.

```js
const Yuuko = require('yuuko')   // TODO: this isn't a real module

const mybot = new Yuuko({
    token: 'your_bot_token',     // Token used to auth your bot account
    defaultPrefix: '.'           // Prefix used to trigger commands
})

const pingCommand = new Yuuko.Command('ping', (client, msg, args) => {
    msg.channel.createMessage('Pong!')
})

mybot.addCommand(pingCommand).connect()
```
