"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortVBind = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const misc_1 = require("../../../misc");
exports.sortVBind = utils.wrapRule(misc_1.misc["no-restricted-syntax"], [
    {
        message: 'Move "v-bind" directive to the end',
        selector: "VStartTag > VAttribute:not(:last-child) > VDirectiveKey.key[argument=null] > VIdentifier.name[name=bind]"
    }
]);
//# sourceMappingURL=sort-v-bind.js.map