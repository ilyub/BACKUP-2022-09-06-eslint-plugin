import * as utils from "./utils";
import {
  Accumulator,
  a,
  createValidationObject,
  evaluate,
  is,
  s
} from "@skylib/functions";
import type { Writable, stringU } from "@skylib/functions";
import type { TSESTree } from "@typescript-eslint/utils";
import type {
  RuleFix,
  RuleListener
} from "@typescript-eslint/utils/dist/ts-eslint";

export const consistentEmptyLines = utils.createRule({
  create: (context): RuleListener => {
    const childNodesMap = new Accumulator<string, TSESTree.Node>();

    const prevRuleIndexes = new Accumulator<string, number>();

    const nextRuleIndexes = new Accumulator<string, number>();

    const prevItems: Writable<Items> = [];

    const nextItems: Writable<Items> = [];

    const listener: RuleListener = {
      "*": (node: TSESTree.Node) => {
        utils.buildChildNodesMap(node, childNodesMap);
      },
      "Program:exit": () => {
        const items = new Map<string, Item>();

        prevItems.sort((item1, item2) => item1.ruleIndex - item2.ruleIndex);
        nextItems.sort((item1, item2) => item1.ruleIndex - item2.ruleIndex);

        for (const prevItem of prevItems)
          for (const nextItem of nextItems)
            if (
              prevItem.ruleIndex === nextItem.ruleIndex &&
              utils.isAdjacentNodes(prevItem.node, nextItem.node, childNodesMap)
            )
              items.set(utils.getNodeId(nextItem.node), nextItem);

        for (const item of items.values()) {
          const emptyLine = a.get(
            context.subOptionsArray,
            item.ruleIndex
          ).emptyLine;

          if (emptyLine === "any") {
            // Skip check
          } else {
            const node = item.node;

            const spread = evaluate(() => {
              switch (emptyLine) {
                case "always":
                  return true;

                case "never":
                  return false;
              }
            });

            const count = spread ? 2 : 1;

            const messageId = spread
              ? "expectingEmptyLine"
              : "unexpectedEmptyLine";

            const got = context.getLeadingTrivia(node);

            const expected =
              context.eol.repeat(count) + s.trimLeadingEmptyLines(got);

            if (got === expected) {
              // Valid
            } else
              context.report({
                data: { _id: item._id },
                fix: (): RuleFix => ({
                  range: [node.range[0] - got.length, node.range[0]],
                  text: expected
                }),
                messageId,
                node
              });
          }
        }
      }
    };

    for (const [ruleIndex, subOptions] of context.subOptionsArray.entries()) {
      prevRuleIndexes.push(subOptions.prev, ruleIndex);
      nextRuleIndexes.push(subOptions.next, ruleIndex);
    }

    for (const subOptions of context.subOptionsArray)
      for (const selector of [subOptions.prev, subOptions.next])
        listener[selector] = (node: TSESTree.Node): void => {
          for (const ruleIndex of prevRuleIndexes.get(selector))
            prevItems.push({
              _id: subOptions._id,
              node,
              ruleIndex
            });

          for (const ruleIndex of nextRuleIndexes.get(selector))
            nextItems.push({
              _id: subOptions._id,
              node,
              ruleIndex
            });
        };

    return listener;
  },
  fixable: "whitespace",
  isRuleOptions: is.object,
  isSubOptions: evaluate(() => {
    const EmptyLineVO = createValidationObject<EmptyLine>({
      always: "always",
      any: "any",
      never: "never"
    });

    const isEmptyLine = is.factory(is.enumeration, EmptyLineVO);

    return is.object.factory<SubOptions>(
      {
        _id: is.string,
        emptyLine: isEmptyLine,
        next: is.string,
        prev: is.string
      },
      {}
    );
  }),
  messages: {
    expectingEmptyLine: "Expecting empty line before ({{ _id }})",
    unexpectedEmptyLine: "Unexpected empty line before ({{ _id }})"
  },
  name: "consistent-empty-lines"
});

type EmptyLine = "always" | "any" | "never";

interface Item {
  // eslint-disable-next-line @skylib/optional-property-style -- Temp
  readonly _id: stringU;
  readonly node: TSESTree.Node;
  readonly ruleIndex: number;
}

type Items = readonly Item[];

interface SubOptions {
  readonly _id: string;
  readonly emptyLine: EmptyLine;
  readonly next: string;
  readonly prev: string;
}
