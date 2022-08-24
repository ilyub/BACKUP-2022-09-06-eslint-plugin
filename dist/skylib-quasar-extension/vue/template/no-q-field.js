"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noQField = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const misc_1 = require("../../../misc");
exports.noQField = utils.wrapRule(misc_1.misc["no-restricted-syntax"], [
    {
        message: 'Use "m-field" component instead',
        selector: "VElement[name=q-field]"
    }
]);
//# sourceMappingURL=no-q-field.js.map