"use strict";
/** @module Yuuko */
Object.defineProperty(exports, "__esModule", { value: true });
const Yuuko_1 = require("../Yuuko");
exports.default = new Yuuko_1.Command('reload', (msg, args, { client }) => {
    msg.channel.sendTyping();
    setTimeout(() => {
        client.reloadFiles();
        msg.channel.createMessage('Reloaded commands.');
    }, 100);
}, {
    owner: true,
});
