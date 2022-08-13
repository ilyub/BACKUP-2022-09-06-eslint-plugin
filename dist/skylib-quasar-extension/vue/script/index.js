"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../../utils"));
const consistent_expose_arg_1 = require("./consistent-expose-arg");
const no_global_icons_1 = require("./no-global-icons");
const no_global_lang_1 = require("./no-global-lang");
const require_prop_type_param_1 = require("./require-prop-type-param");
const require_validateEmit_type_param_1 = require("./require-validateEmit-type-param");
const require_validateProps_type_param_1 = require("./require-validateProps-type-param");
exports.script = utils.prefixKeys("script/", {
    "consistent-expose-arg": consistent_expose_arg_1.consistentExposeArg,
    "no-global-icons": no_global_icons_1.noGlobalIcons,
    "no-global-lang": no_global_lang_1.noGlobalLang,
    "require-prop-type-param": require_prop_type_param_1.requirePropTypeParam,
    "require-validateEmit-type-param": require_validateEmit_type_param_1.requireValidateEmitTypeParam,
    "require-validateProps-type-param": require_validateProps_type_param_1.requireValidatePropsTypeParam
});
//# sourceMappingURL=index.js.map