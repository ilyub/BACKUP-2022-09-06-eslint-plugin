"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRule = exports.setCasing = exports.selector = exports.nodeText = exports.mergeListeners = exports.createRegexpMatcher = exports.createFileMatcher = exports.projectRoot = exports.isTypeGroups = exports.isTypeGroup = exports.isSelector = exports.isRegexpPattern = exports.isFilePattern = exports.isStringOrStrings = exports.isCasing = void 0;
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("@skylib/lodash-commonjs-es"));
const functions_1 = require("@skylib/functions");
const types_1 = require("./types");
const utils_1 = require("@typescript-eslint/utils");
const minimatch_1 = tslib_1.__importDefault(require("minimatch"));
exports.isCasing = functions_1.is.factory(functions_1.is.enumeration, types_1.Casing);
exports.isStringOrStrings = functions_1.is.or.factory(functions_1.is.string, functions_1.is.strings);
exports.isFilePattern = functions_1.is.or.factory(exports.isStringOrStrings, functions_1.is.object.factory({ allow: exports.isStringOrStrings, disallow: exports.isStringOrStrings }, {}));
exports.isRegexpPattern = exports.isStringOrStrings;
exports.isSelector = exports.isStringOrStrings;
exports.isTypeGroup = functions_1.is.factory(functions_1.is.enumeration, types_1.TypeGroup);
exports.isTypeGroups = functions_1.is.factory(functions_1.is.array.of, exports.isTypeGroup);
exports.projectRoot = functions_1.fn.pipe(process.cwd(), functions_1.s.path.canonicalize, functions_1.s.path.addTrailingSlash);
/**
 * Creates file matcher.
 *
 * @param pattern - Pattern.
 * @param defVal - Default value.
 * @param options - Minimatch options.
 * @returns Matcher.
 */
function createFileMatcher(pattern, defVal, options) {
    if (functions_1.is.string(pattern))
        return createFileMatcher([pattern], defVal, options);
    if (functions_1.is.strings(pattern)) {
        const matchers = pattern.map((p) => str => (0, minimatch_1.default)(str, p, options));
        return matchers.length
            ? str => matchers.some(matcher => matcher(str))
            : () => defVal;
    }
    const { allow, disallow } = pattern;
    const allowMatcher = createFileMatcher(allow, false, options);
    const disallowMatcher = createFileMatcher(disallow, true, options);
    return allow.length || disallow.length
        ? str => disallowMatcher(str) && !allowMatcher(str)
        : () => defVal;
}
exports.createFileMatcher = createFileMatcher;
/**
 * Creates matcher.
 *
 * @param pattern - RegExp pattern(s).
 * @param defVal - Default value.
 * @returns Matcher.
 */
function createRegexpMatcher(pattern, defVal) {
    if (functions_1.is.string(pattern))
        return createRegexpMatcher([pattern], defVal);
    const matchers = pattern.map((p) => str => 
    // eslint-disable-next-line security/detect-non-literal-regexp -- Ok
    new RegExp(p, "u").test(str));
    return matchers.length
        ? str => matchers.some(matcher => matcher(str))
        : () => defVal;
}
exports.createRegexpMatcher = createRegexpMatcher;
/**
 * Merges listeners.
 *
 * @param listeners - Listeners.
 * @returns Merged listeners.
 */
function mergeListeners(...listeners) {
    const accumulator = new functions_1.Accumulator();
    for (const listener of listeners)
        for (const [name, visitor] of functions_1.o.entries(listener))
            accumulator.push(name, functions_1.as.callable(visitor));
    // eslint-disable-next-line @skylib/typescript/no-unsafe-object-assignment -- Ok
    return functions_1.o.fromEntries(functions_1.a.fromIterable(accumulator).map(([name, visitors]) => [
        name,
        node => {
            for (const visitor of visitors)
                visitor(node);
        }
    ]));
}
exports.mergeListeners = mergeListeners;
/**
 * Returns string representing node.
 *
 * @param node - Node.
 * @param defVal - Default value.
 * @returns String representing node.
 */
function nodeText(node, defVal) {
    switch (node.type) {
        case utils_1.AST_NODE_TYPES.Identifier:
            return node.name;
        case utils_1.AST_NODE_TYPES.Literal:
            return functions_1.cast.string(node.value);
        default:
            return functions_1.as.callable(defVal)();
    }
}
exports.nodeText = nodeText;
/**
 * Assemles selector.
 *
 * @param raw - Raw selector.
 * @returns Selector.
 */
function selector(raw) {
    return functions_1.a.fromMixed(raw).join(", ");
}
exports.selector = selector;
/**
 * Sets casing.
 *
 * @param str - String.
 * @param casing - Casing.
 * @returns Formatted string.
 */
function setCasing(str, casing) {
    switch (casing) {
        case types_1.Casing.camelCase:
            return _.camelCase(str);
        case types_1.Casing.kebabCase:
            return _.kebabCase(str);
        case types_1.Casing.pascalCase:
            return functions_1.s.ucFirst(_.camelCase(str));
        case undefined:
            return str;
    }
}
exports.setCasing = setCasing;
/**
 * Wraps third-party rule.
 *
 * @param rule - Rule.
 * @param optionsArray - Options.
 * @returns Wrapped rule.
 */
function wrapRule(rule, optionsArray) {
    return Object.assign(Object.assign({}, rule), { create: context => {
            const optionsOverridesArray = optionsArray.map((options, index) => {
                const overrides = context.options[index];
                return functions_1.is.object(options) && functions_1.is.object(overrides)
                    ? Object.assign(Object.assign({}, options), overrides) : options;
            });
            return rule.create(new Proxy({}, (0, functions_1.wrapProxyHandler)("wrap-rule", functions_1.ProxyHandlerAction.throw, {
                get: (_target, key) => key === "options"
                    ? optionsOverridesArray
                    : functions_1.reflect.get(context, key)
            })));
        } });
}
exports.wrapRule = wrapRule;
//# sourceMappingURL=misc.js.map