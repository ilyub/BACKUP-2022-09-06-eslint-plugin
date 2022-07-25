import * as utils from "@/utils";
import getCurrentLine from "get-current-line";
import { rules } from "@";

const rule = rules["no-nodejs-modules"];

const MessageId = utils.getMessageId(rule);

utils.testRule("no-nodejs-modules", rule, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: 'import x from "node:fs";',
    errors: [{ line: 1, messageId: MessageId.disallowedSource }]
  }
]);
