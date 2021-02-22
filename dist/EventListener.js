"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
/** Class associating an event handler with an event. */
class EventListener {
    constructor(event, listener, { once = false } = {}) {
        this.args = [event, listener];
        this.once = once;
    }
    /** The name of the event this listener is attached to */
    get eventName() {
        return this.args[0];
    }
}
exports.EventListener = EventListener;
