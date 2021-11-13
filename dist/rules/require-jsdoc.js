"use strict";
const tslib_1 = require("tslib");
const tsutils = (0, tslib_1.__importStar)(require("tsutils"));
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const is = (0, tslib_1.__importStar)(require("@typerock/functions/dist/guards"));
const core_1 = require("@typerock/functions/dist/types/core");
const utils = (0, tslib_1.__importStar)(require("./utils"));
const InterfaceOptionVO = (0, core_1.createValidationObject)({
    callSignatures: "callSignatures",
    constructSignatures: "constructSignatures",
    interface: "interface"
});
const isInterfaceOption = is.factory(is.enumeration, InterfaceOptionVO);
const isInterfaceOptions = is.factory(is.array.of, isInterfaceOption);
const PropertyOptionVO = (0, core_1.createValidationObject)({
    function: "function",
    nonFunction: "nonFunction"
});
const isPropertyOption = is.factory(is.enumeration, PropertyOptionVO);
const isPropertyOptions = is.factory(is.array.of, isPropertyOption);
const isRuleOptions = is.factory(is.object.of, {
    excludeSelectors: is.strings,
    includeSelectors: is.strings,
    interfaceOptions: isInterfaceOptions,
    noDefaultSelectors: is.boolean,
    propertyOptions: isPropertyOptions
}, {});
const rule = utils.createRule({
    create(context) {
        const selectors = utils.getSelectors(context.options, defaultSelectors);
        return {
            [selectors](node) {
                switch (node.type) {
                    case experimental_utils_1.AST_NODE_TYPES.TSInterfaceDeclaration:
                        lintInterface(node, context);
                        break;
                    case experimental_utils_1.AST_NODE_TYPES.MethodDefinition:
                    case experimental_utils_1.AST_NODE_TYPES.TSMethodSignature:
                        lintMethod(node, context);
                        break;
                    case experimental_utils_1.AST_NODE_TYPES.PropertyDefinition:
                    case experimental_utils_1.AST_NODE_TYPES.TSPropertySignature:
                        lintProperty(node, context);
                        break;
                    default:
                        lintNodeByTypeSymbol(node, context);
                }
            }
        };
    },
    defaultOptions: {
        excludeSelectors: [],
        includeSelectors: [],
        interfaceOptions: ["callSignatures", "constructSignatures", "interface"],
        noDefaultSelectors: false,
        propertyOptions: ["function", "nonFunction"]
    },
    isRuleOptions,
    messages: {
        undocumented: "Missing documentation",
        undocumentedCallSignature: "Missing documentation for call signature",
        undocumentedConstructSignature: "Missing documentation for constructor signature"
    }
});
const defaultSelectors = [
    experimental_utils_1.AST_NODE_TYPES.ClassDeclaration,
    experimental_utils_1.AST_NODE_TYPES.FunctionDeclaration,
    experimental_utils_1.AST_NODE_TYPES.MethodDefinition,
    experimental_utils_1.AST_NODE_TYPES.PropertyDefinition,
    experimental_utils_1.AST_NODE_TYPES.TSCallSignatureDeclaration,
    experimental_utils_1.AST_NODE_TYPES.TSConstructSignatureDeclaration,
    experimental_utils_1.AST_NODE_TYPES.TSDeclareFunction,
    experimental_utils_1.AST_NODE_TYPES.TSInterfaceDeclaration,
    experimental_utils_1.AST_NODE_TYPES.TSMethodSignature,
    experimental_utils_1.AST_NODE_TYPES.TSPropertySignature
];
/**
 * Lints interface.
 *
 * @param node - Node.
 * @param context - Context.
 */
function lintInterface(node, context) {
    const { interfaceOptions } = context.options;
    const tsNode = context.toTsNode(node);
    const type = context.checker.getTypeAtLocation(tsNode);
    if (interfaceOptions.includes("interface"))
        lintNodeByTypeSymbol(node, context);
    if (interfaceOptions.includes("callSignatures"))
        lintCallSignatures(node, type, context);
    if (interfaceOptions.includes("constructSignatures"))
        lintConstructSignatures(node, type, context);
}
/**
 * Lints method.
 *
 * @param node - Node.
 * @param context - Context.
 */
function lintMethod(node, context) {
    const tsNode = context.toTsNode(node);
    if (tsutils.isConstructorDeclaration(tsNode)) {
        const type = tsutils.getConstructorTypeOfClassLikeDeclaration(tsNode.parent, context.checker);
        lintConstructSignatures(node, type, context);
    }
    else
        lintNodeBySymbol(node.key, context);
}
/**
 * Lints property.
 *
 * @param node - Node.
 * @param context - Context.
 */
function lintProperty(node, context) {
    const { propertyOptions } = context.options;
    const typeAnnotation = node.typeAnnotation;
    if (typeAnnotation) {
        const type = typeAnnotation.typeAnnotation.type;
        if (type === experimental_utils_1.AST_NODE_TYPES.TSFunctionType
            ? propertyOptions.includes("function")
            : propertyOptions.includes("nonFunction"))
            lintNodeBySymbol(node.key, context);
    }
}
/**
 * Lints node.
 *
 * @param node - Node.
 * @param context - Context.
 */
function lintNodeBySymbol(node, context) {
    const tsNode = context.toTsNode(node);
    const symbol = context.checker.getSymbolAtLocation(tsNode);
    if (symbol && context.missingDocComment(symbol))
        context.report({
            messageId: "undocumented",
            node
        });
}
/**
 * Lints node.
 *
 * @param node - Node.
 * @param context - Context.
 */
function lintNodeByTypeSymbol(node, context) {
    const tsNode = context.toTsNode(node);
    const symbol = context.checker.getTypeAtLocation(tsNode).getSymbol();
    if (symbol && context.missingDocComment(symbol))
        context.report({
            messageId: "undocumented",
            node
        });
}
/**
 * Lints call signatures.
 *
 * @param node - Node.
 * @param type - Type.
 * @param context - Context.
 */
function lintCallSignatures(node, type, context) {
    if (type
        .getCallSignatures()
        .some(signature => context.missingDocComment(signature)))
        context.report({
            messageId: "undocumentedCallSignature",
            node
        });
}
/**
 * Lints constructor signatures.
 *
 * @param node - Node.
 * @param type - Type.
 * @param context - Context.
 */
function lintConstructSignatures(node, type, context) {
    if (type
        .getConstructSignatures()
        .some(signature => context.missingDocComment(signature)))
        context.report({
            messageId: "undocumentedConstructSignature",
            node
        });
}
module.exports = rule;
//# sourceMappingURL=require-jsdoc.js.map