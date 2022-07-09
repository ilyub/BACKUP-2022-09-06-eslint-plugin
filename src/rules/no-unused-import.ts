import * as utils from "./utils";
import type {
  RuleFix,
  RuleListener
} from "@typescript-eslint/utils/dist/ts-eslint";
import { as, is } from "@skylib/functions";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { TSESTree } from "@typescript-eslint/utils";

export const noUnusedImport = utils.createRule({
  name: "no-unused-import",
  fixable: "code",
  isOptions: is.object,
  messages: { unusedImport: "Unused import" },
  create: (context): RuleListener => {
    const identifiers = new Set<string>();

    // eslint-disable-next-line @skylib/custom/prefer-readonly-array
    const importDeclarations: TSESTree.ImportDeclaration[] = [];

    return {
      [AST_NODE_TYPES.ImportDeclaration]: (node): void => {
        importDeclarations.push(node);
      },
      ":not(ImportDefaultSpecifier,ImportNamespaceSpecifier,ImportSpecifier,Property) > Identifier:not(.property)":
        (node: TSESTree.Identifier): void => {
          identifiers.add(node.name);
        },
      "Program:exit": (): void => {
        for (const node of importDeclarations) {
          const specifiers = node.specifiers
            .filter(used)
            .map(specifier => {
              switch (specifier.type) {
                case AST_NODE_TYPES.ImportDefaultSpecifier:
                  return specifier.local.name;

                case AST_NODE_TYPES.ImportNamespaceSpecifier:
                  return `* as ${specifier.local.name}`;

                case AST_NODE_TYPES.ImportSpecifier:
                  return specifier.imported.name === specifier.local.name
                    ? `{ ${specifier.imported.name} }`
                    : `{ ${specifier.imported.name} as ${specifier.local.name} }`;
              }
            })
            .join(", ")
            .replace(/ \}, \{ /gu, ", ");

          const source = as.string(node.source.value);

          if (node.specifiers.every(used)) {
            // Valid
          } else if (node.specifiers.some(used))
            context.report({
              fix: (): RuleFix => ({
                range: node.range,
                text: `import ${specifiers} from "${source}";`
              }),
              messageId: "unusedImport",
              node
            });
          else
            context.report({
              fix: (): readonly RuleFix[] =>
                context.hasLeadingComment(node)
                  ? []
                  : [
                      {
                        range: context.getRangeWithLeadingTrivia(node),
                        text: ""
                      }
                    ],
              messageId: "unusedImport",
              node
            });
        }

        function used(specifier: TSESTree.ImportClause): boolean {
          return identifiers.has(specifier.local.name);
        }
      },
      "Property > Identifier.value": (node: TSESTree.Identifier): void => {
        identifiers.add(node.name);
      }
    };
  }
});
