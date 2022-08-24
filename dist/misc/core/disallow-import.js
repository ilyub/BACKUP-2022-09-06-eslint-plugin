"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disallowImport = exports.MessageId = void 0;
const tslib_1 = require("tslib");
const ruleTemplates = tslib_1.__importStar(require("../../rule-templates"));
const utils = tslib_1.__importStar(require("../../utils"));
const functions_1 = require("@skylib/functions");
var MessageId;
(function (MessageId) {
    MessageId["disallowedSource"] = "disallowedSource";
})(MessageId = exports.MessageId || (exports.MessageId = {}));
exports.disallowImport = utils.createRule({
    name: "disallow-import",
    isOptions: functions_1.is.object.factory({ allow: utils.isStringOrStrings, disallow: utils.isStringOrStrings }, {}),
    defaultOptions: { allow: [], disallow: [] },
    messages: {
        [MessageId.disallowedSource]: "Import from this source is not allowed"
    },
    create: context => {
        const matcher = utils.createFileMatcher(context.options, false, {
            dot: true
        });
        return ruleTemplates.source(ctx => {
            if (matcher(ctx.source))
                context.report({
                    messageId: MessageId.disallowedSource,
                    node: ctx.node
                });
        });
    }
});
//# sourceMappingURL=disallow-import.js.map