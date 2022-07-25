/* eslint-disable @skylib/consistent-filename -- Ok */

import * as utils from "../../utils";
import { misc } from "../../misc";

export const preferOwnSlots = utils.wrapRule(misc["restrict-syntax"], [
  {
    message: 'Use "OwnSlots" interface',
    selector:
      "TSInterfaceDeclaration[id.name=/^(?:Slots|ParentSlots)$/u] > TSInterfaceBody.body > .body"
  }
]);
