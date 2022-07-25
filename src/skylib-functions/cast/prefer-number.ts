import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferNumber = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: 'Prefer "cast.number" function',
    selector: "CallExpression > .callee[name=Number]"
  }
]);
