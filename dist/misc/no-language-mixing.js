"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noLanguageMixing = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../utils"));
const core_1 = require("./core");
const functions_1 = require("@skylib/functions");
exports.noLanguageMixing = (0, functions_1.evaluate)(() => {
    const br = "[\\d_]*";
    const eng = "\\w";
    const international = "[^\\u0000-\\u00FF]";
    const re = `/${eng}${br}${international}|${international}${br}${eng}/u`;
    return utils.wrapRule(core_1.core["no-restricted-syntax"], [
        {
            message: "No language mixing",
            selector: [`Literal[value=${re}]`, `TemplateLiteral[value.raw=${re}]`]
        }
    ]);
});
//# sourceMappingURL=no-language-mixing.js.map