"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescript = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../utils"));
const consistent_array_type_name_1 = require("./consistent-array-type-name");
const core_1 = require("./core");
const no_complex_declarator_type_1 = require("./no-complex-declarator-type");
const no_complex_return_type_1 = require("./no-complex-return-type");
const no_distributed_function_props_1 = require("./no-distributed-function-props");
const no_this_void_1 = require("./no-this-void");
const no_true_type_1 = require("./no-true-type");
const no_unsafe_object_assign_1 = require("./no-unsafe-object-assign");
const prefer_array_type_alias_1 = require("./prefer-array-type-alias");
const prefer_enum_1 = require("./prefer-enum");
const prefer_readonly_array_1 = require("./prefer-readonly-array");
const prefer_ReadonlyMap_1 = require("./prefer-ReadonlyMap");
const prefer_readonly_property_1 = require("./prefer-readonly-property");
const prefer_ReadonlySet_1 = require("./prefer-ReadonlySet");
const require_prop_type_annotation_1 = require("./require-prop-type-annotation");
exports.typescript = utils.prefixKeys("typescript/", Object.assign(Object.assign({}, core_1.core), { "consistent-array-type-name": consistent_array_type_name_1.consistentArrayTypeName, "no-complex-declarator-type": no_complex_declarator_type_1.noComplexDeclaratorType, "no-complex-return-type": no_complex_return_type_1.noComplexReturnType, "no-distributed-function-props": no_distributed_function_props_1.noDistributedFunctionProps, "no-this-void": no_this_void_1.noThisVoid, "no-true-type": no_true_type_1.noTrueType, "no-unsafe-object-assign": no_unsafe_object_assign_1.noUnsafeObjectAssign, "prefer-ReadonlyMap": prefer_ReadonlyMap_1.preferReadonlyMap, "prefer-ReadonlySet": prefer_ReadonlySet_1.preferReadonlySet, "prefer-array-type-alias": prefer_array_type_alias_1.preferArrayTypeAlias, "prefer-enum": prefer_enum_1.preferEnum, "prefer-readonly-array": prefer_readonly_array_1.preferReadonlyArray, "prefer-readonly-property": prefer_readonly_property_1.preferReadonlyProperty, "require-prop-type-annotation": require_prop_type_annotation_1.requirePropTypeAnnotation }));
//# sourceMappingURL=index.js.map