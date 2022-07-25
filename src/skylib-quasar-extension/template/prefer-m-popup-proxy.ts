import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferMPopupProxy = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: 'Prefer "m-popup-proxy" component',
    selector: "VElement[name=q-popup-proxy]"
  }
]);
