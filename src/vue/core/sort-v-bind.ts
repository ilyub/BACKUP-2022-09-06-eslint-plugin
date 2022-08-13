import * as utils from "../../utils";
import type { AST } from "vue-eslint-parser";
import type { RuleListener } from "@typescript-eslint/utils/dist/ts-eslint";
import { a } from "@skylib/functions";

export enum MessageId {
  incorrectSortingOrder = "incorrectSortingOrder"
}

export const sortVBind = utils.createRule({
  name: "sort-v-bind",
  fixable: utils.Fixable.code,
  vue: true,
  messages: { [MessageId.incorrectSortingOrder]: "Incorrect sorting order" },
  create: (context): RuleListener => ({
    VStartTag: (node: AST.VStartTag) => {
      const vBindIndex = node.attributes.findIndex(
        attribute =>
          attribute.key.type === "VDirectiveKey" &&
          attribute.key.name.name === "bind"
      );

      if (
        node.attributes.some(
          (attribute, index) => index > vBindIndex && !attribute.directive
        )
      )
        context.report({
          loc: context.getLoc(a.get(node.attributes, vBindIndex).range),
          messageId: MessageId.incorrectSortingOrder
        });
    }
  })
});