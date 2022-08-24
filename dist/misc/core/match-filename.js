"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchFilename = exports.MessageId = void 0;
const tslib_1 = require("tslib");
const utils = tslib_1.__importStar(require("../../utils"));
const functions_1 = require("@skylib/functions");
var MessageId;
(function (MessageId) {
    MessageId["invalidText"] = "invalidText";
})(MessageId = exports.MessageId || (exports.MessageId = {}));
exports.matchFilename = utils.createRule({
    name: "match-filename",
    vue: true,
    isOptions: functions_1.is.object.factory({ prefix: functions_1.is.string, selector: utils.isSelector, suffix: functions_1.is.string }, { format: utils.isCasing }),
    defaultOptions: { prefix: "", suffix: "" },
    messages: { [MessageId.invalidText]: "Should match file name: {{expected}}" },
    create: (context) => {
        const { format, prefix, selector: mixedSelector, suffix } = context.options;
        const selector = utils.selector(mixedSelector);
        return {
            [selector]: (node) => {
                const got = utils.nodeText(node, "?");
                const expected = prefix + context.textFromPath(context.filename, got, format) + suffix;
                if (got === expected) {
                    // Valid
                }
                else
                    context.report({
                        data: { expected },
                        messageId: MessageId.invalidText,
                        node
                    });
            }
        };
    }
});
//# sourceMappingURL=match-filename.js.map