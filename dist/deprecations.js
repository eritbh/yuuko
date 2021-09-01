"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
// This function being unused is fine, it just means there's nothing deprecated
// to emit warnings about right now. There will be more in the future :V
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function warningEmitter(warning, code) {
    let hasWarned = false;
    return () => {
        if (hasWarned)
            return;
        hasWarned = true;
        process_1.emitWarning(warning, 'DeprecationWarning', code);
    };
}
