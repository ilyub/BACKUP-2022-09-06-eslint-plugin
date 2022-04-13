"use strict";
const tslib_1 = require("tslib");
const is = tslib_1.__importStar(require("@skylib/functions/dist/guards"));
const helpers_1 = require("@skylib/functions/dist/helpers");
const no_unnecessary_readonliness_1 = require("./utils/no-unnecessary-readonliness");
const TypeToCheckVO = (0, helpers_1.createValidationObject)({
    DeepReadonly: "DeepReadonly",
    Readonly: "Readonly"
});
const isTypeToCheck = is.factory(is.enumeration, TypeToCheckVO);
module.exports = (0, no_unnecessary_readonliness_1.createRule)("no-unnecessary-readonly", isTypeToCheck, "allDefinitelyReadonly", "unnecessaryReadonly", 'Unnecessary "Readonly" or "DeepReadonly"');
//# sourceMappingURL=no-unnecessary-readonly.js.map