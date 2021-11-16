"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventListener_1 = require("../EventListener");
exports.default = new EventListener_1.EventListener('messageCreate', (msg, { client }) => {
    if (!msg.author)
        return; // this is a bug and shouldn't really happen
    if (client.ignoreBots && msg.author.bot)
        return;
    client.processCommand(msg);
});
