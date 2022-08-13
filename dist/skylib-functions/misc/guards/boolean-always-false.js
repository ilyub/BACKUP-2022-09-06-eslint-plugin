"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanAlwaysFalse = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const typescript_1 = require("../../../typescript");
exports.booleanAlwaysFalse = utils.wrapRule(typescript_1.typescript["typescript/no-restricted-syntax"], [
    {
        message: "Expecting type to include boolean or unknown",
        selector: "CallExpression[callee.object.name=/^(?:as|assert|is)$/u][callee.property.name=/^(?:boolean|booleanU)$/u] > .arguments:first-child",
        typeHasNoneOf: [
            utils.TypeGroup.any,
            utils.TypeGroup.boolean,
            utils.TypeGroup.unknown
        ]
    }
]);
//# sourceMappingURL=boolean-always-false.js.map