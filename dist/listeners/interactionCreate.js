"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventListener_1 = require("../EventListener");
exports.default = new EventListener_1.EventListener('interactionCreate', (interaction, { client }) => {
    client.processApplicationCommandResponse(interaction);
});
