import * as utils from "./utils";
import { a, is, o } from "@skylib/functions";
import type { strings } from "@skylib/functions";
import type { TSESTree } from "@typescript-eslint/utils";

export const noRestrictedSyntax = utils.createRule({
  create: context =>
    o.fromEntries(
      context.subOptionsArray.map(subOptions => {
        const { message, replacement, search, selector: mixed } = subOptions;

        const selector = a.fromMixed(mixed).join(", ");

        return [
          selector,
          (node: TSESTree.Node): void => {
            const range = node.range;

            context.report({
              data: {
                message: message ?? `This syntax is not allowed: ${selector}`
              },
              fix: () =>
                is.not.empty(replacement)
                  ? [
                      {
                        range,
                        text: is.not.empty(search)
                          ? context.getText(node).replace(
                              // eslint-disable-next-line security/detect-non-literal-regexp -- Ok
                              new RegExp(search, "u"),
                              replacement
                            )
                          : replacement
                      }
                    ]
                  : [],
              loc: context.getLocFromRange(range),
              messageId: "customMessage"
            });
          }
        ];
      })
    ),
  fixable: "code",
  isRuleOptions: is.object,
  isSubOptions: is.object.factory<SubOptions>(
    { selector: is.or.factory(is.string, is.strings) },
    {
      message: is.string,
      replacement: is.string,
      search: is.string
    }
  ),
  messages: { customMessage: "{{ message }}" },
  name: "no-restricted-syntax"
});

interface SubOptions {
  readonly message?: string;
  readonly replacement?: string;
  readonly search?: string;
  readonly selector: strings | string;
}
