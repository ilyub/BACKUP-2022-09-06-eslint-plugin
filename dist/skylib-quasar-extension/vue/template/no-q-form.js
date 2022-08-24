"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noQForm = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const misc_1 = require("../../../misc");
exports.noQForm = utils.wrapRule(misc_1.misc["no-restricted-syntax"], [
    {
        message: 'Use "m-form" component instead',
        selector: "VElement[name=q-form]"
    }
]);
//# sourceMappingURL=no-q-form.js.map