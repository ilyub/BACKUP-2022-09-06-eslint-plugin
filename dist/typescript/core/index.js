"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.core = void 0;
const array_callback_return_type_1 = require("./array-callback-return-type");
const exhaustive_switch_1 = require("./exhaustive-switch");
const no_inferrable_types_1 = require("./no-inferrable-types");
const no_multi_type_tuples_1 = require("./no-multi-type-tuples");
const no_unsafe_object_assignment_1 = require("./no-unsafe-object-assignment");
const restrict_syntax_1 = require("./restrict-syntax");
exports.core = {
    "array-callback-return-type": array_callback_return_type_1.arrayCallbackReturnType,
    "exhaustive-switch": exhaustive_switch_1.exhaustiveSwitch,
    "no-inferrable-types": no_inferrable_types_1.noInferrableTypes,
    "no-multi-type-tuples": no_multi_type_tuples_1.noMultiTypeTuples,
    "no-unsafe-object-assignment": no_unsafe_object_assignment_1.noUnsafeObjectAssignment,
    "restrict-syntax": restrict_syntax_1.restrictSyntax
};
//# sourceMappingURL=index.js.map