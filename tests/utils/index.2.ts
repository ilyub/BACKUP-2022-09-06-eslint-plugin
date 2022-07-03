import { rules, utils } from "@";
import getCurrentLine from "get-current-line";

utils.testRule(
  "no-restricted-syntax",
  rules,
  [
    {
      code: "invalid();",
      errors: [{ line: 1, messageId: "customMessage" }],
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ rules: [{ _id: "rule-id", selector: "Identifier" }] }]
    },
    {
      code: "invalid();",
      errors: [{ line: 1, messageId: "customMessage" }],
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          rules: [
            {
              _id: "rule-id",
              filesToLint: ["./fixtures/file.ts"],
              filesToSkip: ["./fixtures/**", "./other/**"],
              selector: "Identifier"
            }
          ]
        }
      ]
    }
  ],
  [
    { code: "invalid();", name: `Test at line ${getCurrentLine().line}` },
    {
      code: "invalid();",
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          rules: [
            {
              _id: "rule-id",
              filesToSkip: ["./fixtures/**"],
              selector: "Identifier"
            }
          ]
        }
      ]
    },
    {
      code: "invalid();",
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          rules: [
            {
              _id: "rule-id",
              filesToLint: ["./other/**"],
              selector: "Identifier"
            }
          ]
        }
      ]
    },
    {
      code: `
        /* disable no-restricted-syntax[rule-id] */

        invalid();
      `,
      name: `Test at line ${getCurrentLine().line}`,
      options: [{ rules: [{ _id: "rule-id", selector: "Identifier" }] }]
    }
  ]
);
