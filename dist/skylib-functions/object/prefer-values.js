"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferValues = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../utils"));
const misc_1 = require("../../misc");
exports.preferValues = utils.wrapRule(misc_1.misc["restrict-syntax"], [
    {
        message: 'Prefer "o.values" function',
        selector: "CallExpression > .callee[object.name=Object][property.name=values]"
    }
]);
//# sourceMappingURL=prefer-values.js.map