import * as utils from "@/utils";
import getCurrentLine from "get-current-line";
import { rules } from "@";

const rule = rules["functions/array/prefer-second"];

const MessageId = utils.getMessageId(rule);

utils.testRule("prefer-second", rule, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: "a.get(arr, 1);",
    errors: [{ line: 1, messageId: MessageId.customMessage }]
  }
]);
