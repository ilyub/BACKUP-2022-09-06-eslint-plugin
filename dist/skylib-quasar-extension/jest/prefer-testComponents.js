"use strict";
/* eslint-disable @skylib/consistent-filename -- Ok */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferTestComponents = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../utils"));
const misc_1 = require("../../misc");
exports.preferTestComponents = utils.wrapRule(misc_1.misc["no-restricted-syntax"], [
    {
        message: 'Prefer "testComponents"',
        selector: "CallExpression[callee.object.name=wrapper][callee.property.name=findComponent] > MemberExpression.arguments:first-child > Identifier.object[name=components]"
    }
]);
//# sourceMappingURL=prefer-testComponents.js.map