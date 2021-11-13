"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
const tslib_1 = require("tslib");
const tsutils = (0, tslib_1.__importStar)(require("tsutils"));
const ts = (0, tslib_1.__importStar)(require("typescript"));
const assert = (0, tslib_1.__importStar)(require("@typerock/functions/dist/assertions"));
const cast = (0, tslib_1.__importStar)(require("@typerock/functions/dist/converters"));
const is = (0, tslib_1.__importStar)(require("@typerock/functions/dist/guards"));
const utils = (0, tslib_1.__importStar)(require("."));
class Checker {
    /**
     * Creates class instance.
     *
     * @param options - Options.
     */
    constructor(options) {
        var _a;
        /*
        |*****************************************************************************
        |* Protected
        |*****************************************************************************
        |*/
        Object.defineProperty(this, "checker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignoreClasses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignoreTypeParameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignoreTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "readonliness", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "seenTypesPool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        this.checker = options.context.checker;
        this.ignoreClasses = options.ignoreClasses;
        this.ignoreTypeParameters = (_a = options.ignoreTypeParameters) !== null && _a !== void 0 ? _a : false;
        this.ignoreTypes = new Set(options.ignoreTypes);
        this.readonliness = options.readonliness;
    }
    /**
     * Checks type.
     *
     * @param type - Type.
     * @param restElement - Rest element.
     * @returns Validation result.
     */
    checkType(type, restElement = false) {
        this.seenTypesPool.clear();
        return this.recurs(type, restElement);
    }
    /**
     * Checks mapped type nodes.
     *
     * @param type - Type.
     * @returns Validation result.
     */
    checkMappedTypeNodes(type) {
        const symbol = type.getSymbol();
        if (symbol) {
            const declarations = cast.not.empty(symbol.getDeclarations(), []);
            const nodes = declarations.filter(tsutils.isMappedTypeNode);
            if (nodes.length) {
                const readonly = nodes.every(node => readonlyMappedTypeNode(node));
                if (this.invalidReadonliness(readonly, "property"))
                    return { failed: true, types: [type] };
            }
        }
        return { passed: true };
    }
    /**
     * Checks object type.
     *
     * @param type - Type.
     * @param restElement - Rest element.
     * @returns Validation result.
     */
    checkObjectType(type, restElement) {
        {
            const result = this.checkProperties(type, restElement);
            if ("failed" in result)
                return result;
        }
        {
            const result = this.checkSignatures(type, restElement);
            if ("failed" in result)
                return result;
        }
        if (tsutils.isTypeReference(type))
            return this.checkSubTypes(type, this.checker.getTypeArguments(type));
        return { passed: true };
    }
    /**
     * Checks properties.
     *
     * @param type - Type.
     * @param restElement - Rest element.
     * @returns Validation result.
     */
    checkProperties(type, restElement) {
        const isArrayProperty = this.checker.isArrayType(type) || this.checker.isTupleType(type)
            ? (name) => arrayProperties.has(name)
            : () => false;
        for (const property of type.getProperties())
            if (property.name === "prototype" ||
                property.name.startsWith("__@") ||
                isArrayProperty(property.name)) {
                // Ignore
            }
            else {
                if (!restElement &&
                    this.invalidReadonliness(tsutils.isPropertyReadonlyInType(type, property.getEscapedName(), this.checker), "property"))
                    return { failed: true, types: [type] };
                {
                    const subtype = this.checker.getTypeOfPropertyOfType(type, property.name);
                    assert.not.empty(subtype);
                    const result = this.checkSubTypes(type, [subtype]);
                    if ("failed" in result)
                        return result;
                }
            }
        return { passed: true };
    }
    /**
     * Checks signatures.
     *
     * @param type - Type.
     * @param restElement - Rest element.
     * @returns Validation result.
     */
    checkSignatures(type, restElement) {
        for (const { indexKind, sourceType } of signatures) {
            const indexInfo = this.checker.getIndexInfoOfType(type, indexKind);
            if (indexInfo) {
                if (!restElement &&
                    this.invalidReadonliness(indexInfo.isReadonly, sourceType))
                    return { failed: true, types: [type] };
                {
                    const result = this.checkSubTypes(type, [indexInfo.type]);
                    if ("failed" in result)
                        return result;
                }
            }
        }
        return { passed: true };
    }
    /**
     * Checks subtypes.
     *
     * @param type - Type.
     * @param subtypes - Subtypes.
     * @returns Validation result.
     */
    checkSubTypes(type, subtypes) {
        for (const subtype of subtypes) {
            const result = this.recurs(subtype);
            if ("failed" in result)
                return {
                    failed: true,
                    types: [type, ...result.types]
                };
        }
        return { passed: true };
    }
    /**
     * Checks type parameter.
     *
     * @param type - Type.
     * @returns Validation result.
     */
    checkTypeParameter(type) {
        if (this.ignoreTypeParameters) {
            // Ignore
        }
        else {
            const constraint = type.getConstraint();
            if (constraint && primitiveTypes.has(constraint.getFlags())) {
                // Primitive type
            }
            else
                return { failed: true, types: [type] };
        }
        return { passed: true };
    }
    /**
     * Checks if type readonliness is invalid.
     *
     * @param typeIsReadonly - Whether type is readonly.
     * @param sourceType - Source type.
     * @returns _True_ if type readonliness is invalid, _false_ otherwise.
     */
    invalidReadonliness(typeIsReadonly, sourceType) {
        switch (this.readonliness) {
            case "allReadonly":
                return !typeIsReadonly;
            case "allWritable":
                return typeIsReadonly;
            case "numberSignatureReadonly":
                return sourceType === "numberSignature" && !typeIsReadonly;
            case "stringSignatureReadonly":
                return sourceType === "stringSignature" && !typeIsReadonly;
        }
    }
    /**
     * Checks type.
     *
     * @param type - Type.
     * @param restElement - Rest element.
     * @returns Validation result.
     */
    recurs(type, restElement = false) {
        if (this.seenTypesPool.has(type))
            return { passed: true };
        this.seenTypesPool.add(type);
        if (this.ignoreClasses && type.isClass())
            return { passed: true };
        if (this.ignoreTypes.has(utils.getTypeName(type)))
            return { passed: true };
        {
            const result = this.checkMappedTypeNodes(type);
            if ("failed" in result)
                return result;
        }
        if (tsutils.isIntersectionType(type))
            return this.checkSubTypes(type, tsutils.intersectionTypeParts(type));
        if (tsutils.isObjectType(type))
            return this.checkObjectType(type, restElement);
        if (tsutils.isTypeParameter(type))
            return this.checkTypeParameter(type);
        if (tsutils.isUnionType(type))
            return this.checkSubTypes(type, tsutils.unionTypeParts(type));
        return { passed: true };
    }
}
exports.Checker = Checker;
const arrayProperties = new Set(Object.getOwnPropertyNames(Array.prototype));
const primitiveTypes = new Set([
    ts.TypeFlags.BigInt,
    ts.TypeFlags.BigIntLiteral,
    ts.TypeFlags.Boolean,
    ts.TypeFlags.BooleanLiteral,
    ts.TypeFlags.ESSymbol,
    ts.TypeFlags.Null,
    ts.TypeFlags.Number,
    ts.TypeFlags.NumberLiteral,
    ts.TypeFlags.String,
    ts.TypeFlags.StringLiteral,
    ts.TypeFlags.Undefined,
    ts.TypeFlags.UniqueESSymbol,
    ts.TypeFlags.Void
]);
const readonlySyntaxKinds = new Set([
    ts.SyntaxKind.PlusToken,
    ts.SyntaxKind.ReadonlyKeyword
]);
const signatures = [
    { indexKind: ts.IndexKind.Number, sourceType: "numberSignature" },
    { indexKind: ts.IndexKind.String, sourceType: "stringSignature" }
];
/**
 * Checks if mapped type node is readonly.
 *
 * @param node - Node.
 * @returns _True_ if mapped type node is readonly, _false_ otherwise.
 */
function readonlyMappedTypeNode(node) {
    return (is.not.empty(node.readonlyToken) &&
        readonlySyntaxKinds.has(node.readonlyToken.kind));
}
//# sourceMappingURL=readonliness.js.map