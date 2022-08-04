"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFormat = exports.MessageId = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../utils"));
const functions_1 = require("@skylib/functions");
var MessageId;
(function (MessageId) {
    MessageId["preferMultiline"] = "preferMultiline";
    MessageId["preferSingleLine"] = "preferSingleLine";
})(MessageId = exports.MessageId || (exports.MessageId = {}));
exports.objectFormat = utils.createRule({
    name: "object-format",
    fixable: utils.Fixable.code,
    vue: true,
    isOptions: functions_1.is.object.factory({ maxLineLength: functions_1.is.number, maxObjectSize: functions_1.is.number }, {}),
    defaultOptions: { maxLineLength: 75, maxObjectSize: 3 },
    messages: {
        [MessageId.preferMultiline]: "Prefer multiline object literal",
        [MessageId.preferSingleLine]: "Prefer single-line object literal"
    },
    create: (context) => {
        const eol = context.eol;
        const comma = ",";
        const commaEol = `,${eol}`;
        const { maxLineLength, maxObjectSize } = context.options;
        return {
            ObjectExpression: node => {
                const texts = node.properties.map(property => context.getFullText(property).trim());
                if (texts.length) {
                    const expectMultiline = texts.length > maxObjectSize ||
                        predictedLength() > maxLineLength ||
                        texts.some(functions_1.s.multiline) ||
                        node.properties.some(context.hasTrailingComment);
                    const gotMultiline = functions_1.s.multiline(context.getText(node));
                    if (expectMultiline === gotMultiline) {
                        // Valid
                    }
                    else
                        context.report({
                            fix: () => ({
                                range: node.range,
                                text: expectMultiline
                                    ? `{${eol}${texts.join(commaEol)}${eol}}`
                                    : `{${texts.join(comma)}}`
                            }),
                            messageId: expectMultiline
                                ? MessageId.preferMultiline
                                : MessageId.preferSingleLine,
                            node
                        });
                }
                function predictedLength() {
                    const head = context.getLoc(node.range).start.column;
                    const contents = functions_1.num.sum(...texts.map(text => text.length));
                    const commas = 2 * (texts.length - 1);
                    const brackets = 4;
                    const tail = firstLine(context.getText(node.range[1]))
                        // eslint-disable-next-line regexp/optimal-quantifier-concatenation -- Wait for https://github.com/ota-meshi/eslint-plugin-regexp/issues/451
                        .replace(/^((?: as const)?\S*).*/u, "$1").length;
                    return head + contents + commas + brackets + tail;
                }
            }
        };
    }
});
/**
 * Returns first line.
 *
 * @param str - String.
 * @returns First line.
 */
// eslint-disable-next-line no-warning-comments -- Wait for @skylib/functions update
// fixme
function firstLine(str) {
    return functions_1.a.first(functions_1.s.lines(str));
}
//# sourceMappingURL=object-format.js.map