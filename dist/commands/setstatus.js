"use strict";
/** @module Yuuko */
Object.defineProperty(exports, "__esModule", { value: true });
const Yuuko_1 = require("../Yuuko");
exports.default = new Yuuko_1.Command(['setstatus', 'setgame'], (msg, args, { client }) => {
    let status = args.shift();
    switch (status) {
        case 'dnd':
        case 'red':
            status = 'dnd';
            break;
        case 'idle':
        case 'yellow':
            status = 'idle';
            break;
        case 'invisible':
        case 'invis':
        case 'grey':
        case 'none':
            status = 'invisible';
            break;
        case 'online':
        case 'green':
            status = 'online';
            break;
        default:
            if (status) {
                args.unshift(status);
            }
            status = 'online';
    }
    const game = args.join(' ');
    // @ts-ignore // TODO
    client.editStatus(status, game ? { name: game } : undefined);
}, {
    owner: true,
});
