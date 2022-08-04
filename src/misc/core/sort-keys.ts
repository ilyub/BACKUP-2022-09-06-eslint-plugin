import * as _ from "@skylib/lodash-commonjs-es";
import * as utils from "../../utils";
import type { Writable, strings } from "@skylib/functions";
import { a, is } from "@skylib/functions";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { RuleListener } from "@typescript-eslint/utils/dist/ts-eslint";
import type { TSESTree } from "@typescript-eslint/utils";

export interface SubOptions {
  readonly _id: string;
  readonly customOrder?: strings;
  readonly selector: utils.Selector;
  readonly sendToBottom?: string;
  readonly sendToTop?: string;
}

export enum MessageId {
  expectingObject = "expectingObject"
}

export const sortKeys = utils.createRule({
  name: "sort-keys",
  fixable: utils.Fixable.code,
  vue: true,
  isSubOptions: is.object.factory<SubOptions>(
    { _id: is.string, selector: utils.isSelector },
    { customOrder: is.strings, sendToBottom: is.string, sendToTop: is.string }
  ),
  subOptionsKey: "overrides",
  messages: {
    ...utils.sort.messages,
    [MessageId.expectingObject]: "Expecting object ({{_id}})"
  },
  create: (context): RuleListener => {
    const items: Writable<Items> = [];

    return utils.mergeListenters(
      ...context.subOptionsArray.map((subOptions): RuleListener => {
        const { _id, selector: mixed } = subOptions;

        const selector = a.fromMixed(mixed).join(", ");

        return {
          [selector]: (node: TSESTree.Node) => {
            if (node.type === AST_NODE_TYPES.ObjectExpression)
              items.push({ node, options: { ...subOptions, keyNode } });
            else
              context.report({
                data: { _id },
                messageId: MessageId.expectingObject,
                node
              });
          }
        };
      }),
      {
        "ObjectExpression": node => {
          items.push({ node, options: { keyNode } });
        },
        "Program:exit": () => {
          for (const item of _.uniqBy(a.sort(items, reverseCompare), "node"))
            utils.sort(item.node.properties, context, item.options);
        }
      }
    );

    function keyNode(node: ObjectMember): TSESTree.Node | undefined {
      return node.type === AST_NODE_TYPES.SpreadElement ? undefined : node.key;
    }
  }
});

interface Item {
  readonly node: TSESTree.ObjectExpression;
  readonly options: utils.sort.Options<ObjectMember>;
}

type Items = readonly Item[];

type ObjectMember =
  | TSESTree.MethodDefinition
  | TSESTree.Property
  | TSESTree.SpreadElement;

/**
 * Compares items.
 *
 * @param item1 - First item.
 * @param item2 - Second item.
 * @returns - Comparison result.
 */
function reverseCompare(item1: Item, item2: Item): -1 | 0 | 1 {
  return utils.compare(item2.options._id, item1.options._id);
}