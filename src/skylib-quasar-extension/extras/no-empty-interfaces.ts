import * as utils from "../../utils";
import { misc } from "../../misc";

export const noEmptyInterfaces = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: "Empty interface is not allowed",
    selector:
      "TSInterfaceDeclaration[body.body.length=0][extends=undefined] > .id[name!=Props][name!=Slots]"
  }
]);
