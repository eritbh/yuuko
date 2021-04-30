"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Yuuko_1 = require("../../Yuuko");
Yuuko_1.registerArgumentType('number', (args, { lowerBound = Number.MIN_SAFE_INTEGER, upperBound = Number.MAX_SAFE_INTEGER, radix = 10, }) => {
    // shift()! is appropriate here solely because `parseFloat(undefined)` is `NaN`
    const num = parseInt(args.shift(), radix);
    if (num < lowerBound || num > upperBound) {
        throw new RangeError(`${num} is not between ${lowerBound} and ${upperBound}`);
    }
    return num;
});
