"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Yuuko_1 = require("../../Yuuko");
Yuuko_1.registerArgumentType('number', (args, { lowerBound = -Infinity, upperBound = Infinity, }) => {
    // shift()! is appropriate here solely because `parseFloat(undefined)` is `NaN`
    const num = parseFloat(args.shift());
    if (num < lowerBound || num > upperBound) {
        throw new RangeError(`${num} is not between ${lowerBound} and ${upperBound}`);
    }
    return num;
});
