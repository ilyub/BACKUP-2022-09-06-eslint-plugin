/* eslint-disable @skylib/match-filename/project/testRule-name -- Ok */

import * as utils from "@/utils";
import getCurrentLine from "get-current-line";
import { rules } from "@";

const rule = rules["functions/guards/instanceOf-always-false"];

const MessageId = utils.getMessageId(rule);

utils.testRule("instanceOf-always-false", rule, [
  {
    name: `Test at line ${getCurrentLine().line}`,
    code: "is.instanceOf(1);",
    errors: [{ line: 1, messageId: MessageId.customMessage }]
  }
]);
