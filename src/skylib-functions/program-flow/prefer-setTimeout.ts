/* eslint-disable @skylib/consistent-filename -- Ok */

import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferSetTimeout = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: 'Prefer "programFlow.setTimeout" function',
    selector: "CallExpression > .callee[name=setTimeout]"
  }
]);
