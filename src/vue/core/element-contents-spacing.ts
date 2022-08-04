import * as utils from "../../utils";
import type {
  RuleFix,
  RuleListener
} from "@typescript-eslint/utils/dist/ts-eslint";
import { a, evaluate, s } from "@skylib/functions";
import type { AST } from "vue-eslint-parser";

export enum MessageId {
  addSpaces = "addSpaces",
  removeSpaces = "removeSpaces"
}

export const elementContentsSpacing = utils.createRule({
  create: (context): RuleListener => ({
    VElement: (node: AST.VElement) => {
      if (node.children.length) {
        const range = evaluate(() => {
          const { children } = node;

          const first = a.first(children);

          const last = a.last(children);

          return [first.range[0], last.range[1]] as const;
        });

        const got = context.getText(range);

        const leadingSpaces = s.leadingSpaces(got);

        const trailingSpaces = s.trailingSpaces(got);

        if (s.multiline(got) && (!leadingSpaces || !trailingSpaces))
          context.report({
            fix: (): RuleFix => ({ range, text: ` ${got.trim()} ` }),
            loc: context.getLoc(range),
            messageId: MessageId.addSpaces
          });

        if (s.singleLine(got) && (leadingSpaces || trailingSpaces))
          context.report({
            fix: (): RuleFix => ({ range, text: got.trim() }),
            loc: context.getLoc(range),
            messageId: MessageId.removeSpaces
          });
      }
    }
  }),
  fixable: utils.Fixable.code,
  messages: {
    [MessageId.addSpaces]: "Add spaces around double curly",
    [MessageId.removeSpaces]: "Remove spaces around double curly"
  },
  name: "element-contents-spacing",
  vue: true
});