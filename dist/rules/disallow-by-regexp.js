"use strict";
const tslib_1 = require("tslib");
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const a = (0, tslib_1.__importStar)(require("@skylib/functions/dist/array"));
const is = (0, tslib_1.__importStar)(require("@skylib/functions/dist/guards"));
const regexp = (0, tslib_1.__importStar)(require("@skylib/functions/dist/regexp"));
const core_1 = require("@skylib/functions/dist/types/core");
const utils = (0, tslib_1.__importStar)(require("./utils"));
const SubOptionsContextVO = (0, core_1.createValidationObject)({
    code: "code",
    comment: "comment",
    string: "string"
});
const isSubOptionsContext = is.factory(is.enumeration, SubOptionsContextVO);
const isSubOptionsContexts = is.factory(is.array.of, isSubOptionsContext);
const isRuleOptions = is.factory(is.object.of, { contexts: isSubOptionsContexts }, {});
const isSubOptions = is.factory(is.object.of, { patterns: is.strings }, { contexts: isSubOptionsContexts, replacement: is.string });
const rule = utils.createRule({
    create(context) {
        const strings = [];
        return {
            [experimental_utils_1.AST_NODE_TYPES.Literal](node) {
                strings.push(node.range);
            },
            [experimental_utils_1.AST_NODE_TYPES.TemplateLiteral](node) {
                strings.push(node.range);
            },
            "Program:exit"(program) {
                var _a;
                const comments = utils
                    .getComments(program)
                    .map(comment => comment.range);
                for (const subOptions of context.subOptionsArray) {
                    const contexts = (_a = subOptions.contexts) !== null && _a !== void 0 ? _a : context.options.contexts;
                    for (const pattern of subOptions.patterns) {
                        const re = new RegExp(pattern, "u");
                        for (const range of matchAll(re, context))
                            if (contexts.includes(getContext(range, comments, strings)))
                                context.report({
                                    fix() {
                                        return is.not.empty(subOptions.replacement)
                                            ? [
                                                {
                                                    range,
                                                    text: context.code
                                                        .slice(...range)
                                                        .replace(re, subOptions.replacement)
                                                }
                                            ]
                                            : [];
                                    },
                                    loc: context.getLocFromRange(range),
                                    messageId: "disallowedCode"
                                });
                    }
                }
            }
        };
    },
    defaultOptions: {
        contexts: ["code", "comment", "string"]
    },
    fixable: "code",
    isRuleOptions,
    isSubOptions,
    messages: {
        disallowedCode: "Disallowed code"
    }
});
/**
 * Gets suboptions context.
 *
 * @param range - Range.
 * @param comments - Comment ranges.
 * @param strings - String ranges.
 * @returns Suboptions context.
 */
function getContext(range, comments, strings) {
    if (inRanges(range, comments))
        return "comment";
    if (inRanges(range, strings))
        return "string";
    return "code";
}
/**
 * Checks that range belongs to one of ranges.
 *
 * @param range - Range.
 * @param ranges - Ranges.
 * @returns _True_ if range belongs to one of ranges, _false_ otherwise.
 */
function inRanges(range, ranges) {
    return ranges.some(candidate => range[0] >= candidate[0] && range[1] <= candidate[1]);
}
/**
 * Gets ranges matching regular expression.
 *
 * @param re - Regular expression.
 * @param context - Context.
 * @returns Ranges matching regular expression.
 */
function matchAll(re, context) {
    return regexp
        .matchAll(context.code, re)
        .map(match => [match.index, match.index + a.first(match).length]);
}
module.exports = rule;
//# sourceMappingURL=disallow-by-regexp.js.map