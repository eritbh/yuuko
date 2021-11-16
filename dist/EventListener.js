"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
/** Class associating an event handler with an event. */
class EventListener {
    constructor(eventName, listener, { once = false, } = {}) {
        this.eventName = eventName;
        this.listener = listener;
        this.once = once;
    }
    /**
     * The arguments passed to `client.on()` to register this listener
     * @deprecated This property is no longer used internally and is only
     * provided as a getter for backwards compatibility. Notably, its second
     * argument has never referred to the actual function instance registered on
     * the client; reference `eventName` and `listener` directly instead.
     */
    get args() {
        return [this.eventName, this.listener];
    }
}
exports.EventListener = EventListener;
