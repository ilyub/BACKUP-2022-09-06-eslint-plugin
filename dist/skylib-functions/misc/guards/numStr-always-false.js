"use strict";
/* eslint-disable @skylib/consistent-filename -- Ok */
Object.defineProperty(exports, "__esModule", { value: true });
exports.numStrAlwaysFalse = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const typescript_1 = require("../../../typescript");
exports.numStrAlwaysFalse = utils.wrapRule(typescript_1.typescript["typescript/no-restricted-syntax"], [
    {
        message: "Expecting type to include number, string or unknown",
        selector: "CallExpression[callee.object.name=/^(?:as|assert|is)$/u][callee.property.name=/^(?:numStr|numStrU)$/u] > .arguments:first-child",
        typeHasNoneOf: [
            utils.TypeGroup.any,
            utils.TypeGroup.number,
            utils.TypeGroup.string,
            utils.TypeGroup.unknown
        ]
    }
]);
//# sourceMappingURL=numStr-always-false.js.map