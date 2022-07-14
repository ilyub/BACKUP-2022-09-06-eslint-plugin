import {
  MessageId,
  templateLiteralFormat
} from "@/rules/template-literal-format";
import getCurrentLine from "get-current-line";
import { utils } from "@";

utils.testRule("template-literal-format", templateLiteralFormat, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: `
      const x = \`template literal\`;

      const y = \`template literal
        \`;

      const y = \`
        template literal\`;
    `,
    errors: [
      {
        line: 3,
        endLine: 4,
        messageId: MessageId.invalidTemplateLiteralFormat
      },
      {
        line: 6,
        endLine: 7,
        messageId: MessageId.invalidTemplateLiteralFormat
      }
    ]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: `
      const x = \`
          template literal

          template literal
          \`;
    `,
    output: `
      const x = \`
        template literal

        template literal
      \`;
    `,
    errors: [{ endLine: 5, messageId: MessageId.invalidTemplateLiteralFormat }]
  },
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: `
      {
        const y = \`
      template literal

      template literal
      \`;
      }
    `,
    output: `
      {
        const y = \`
          template literal

          template literal
        \`;
      }
    `,
    errors: [
      {
        line: 2,
        endLine: 6,
        messageId: MessageId.invalidTemplateLiteralFormat
      }
    ]
  }
]);
