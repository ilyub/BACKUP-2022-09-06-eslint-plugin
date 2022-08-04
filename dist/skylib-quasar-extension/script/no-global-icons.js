"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noGlobalIcons = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../utils"));
const misc_1 = require("../../misc");
exports.noGlobalIcons = utils.wrapRule(misc_1.misc["restrict-syntax"], [
    {
        message: "No global icons",
        selector: "ImportDeclaration[source.value=@skylib/facades] > ImportSpecifier[imported.name=icons]"
    }
]);
//# sourceMappingURL=no-global-icons.js.map