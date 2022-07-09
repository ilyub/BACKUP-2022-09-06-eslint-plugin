import { rules, utils } from "@";
import getCurrentLine from "get-current-line";

utils.testRule(
  "consistent-import",
  rules,
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          sources: [
            {
              _id: "id",
              source: "source",
              type: "wildcard"
            }
          ]
        }
      ],
      code: 'import source from "source"',
      errors: [
        {
          data: { _id: "id" },
          line: 1,
          messageId: "wildcardImportRequired"
        }
      ]
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          sources: [
            {
              _id: "id",
              filesToLint: ["./fixtures/file.ts"],
              filesToSkip: ["./fixtures/**", "./other/**"],
              source: "source",
              type: "wildcard"
            }
          ]
        }
      ],
      code: 'import source from "source"',
      errors: [
        {
          data: { _id: "id" },
          line: 1,
          messageId: "wildcardImportRequired"
        }
      ]
    }
  ],
  [
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          sources: [
            {
              _id: "id",
              filesToSkip: ["./fixtures/**"],
              source: "source",
              type: "wildcard"
            }
          ]
        }
      ],
      code: 'import source from "source"'
    },
    {
      name: `Test at line ${getCurrentLine().line}`,
      options: [
        {
          sources: [
            {
              _id: "id",
              filesToLint: ["./other/**"],
              source: "source",
              type: "wildcard"
            }
          ]
        }
      ],
      code: 'import source from "source"'
    }
  ]
);
