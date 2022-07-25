import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferMToggle = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: 'Prefer "m-toggle" component',
    selector: "VElement[name=q-toggle]"
  }
]);
