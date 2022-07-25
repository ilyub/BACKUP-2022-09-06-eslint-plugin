/* eslint-disable @skylib/consistent-filename -- Ok */

import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferSlotsInterface = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: "Use interface",
    selector: "TSTypeAliasDeclaration > Identifier.id[name=Slots]"
  }
]);
