import * as utils from "@/utils";
import getCurrentLine from "get-current-line";
import { rules } from "@";

const rule = rules["functions/array/prefer-reverse"];

const MessageId = utils.getMessageId(rule);

utils.testRule("prefer-reverse", rule, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: "[].reverse();",
    errors: [{ line: 1, messageId: MessageId.customMessage }]
  }
]);
