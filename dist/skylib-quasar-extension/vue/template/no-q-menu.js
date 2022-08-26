"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noQMenu = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const misc_1 = require("../../../misc");
exports.noQMenu = utils.wrapRule(misc_1.misc["no-restricted-syntax"], [
    {
        message: 'Use "m-menu" component instead',
        selector: "VElement[name=q-menu]"
    }
]);
//# sourceMappingURL=no-q-menu.js.map