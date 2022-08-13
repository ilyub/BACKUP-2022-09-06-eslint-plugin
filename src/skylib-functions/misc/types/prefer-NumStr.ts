/* eslint-disable @skylib/consistent-filename -- Postponed */

import * as utils from "../../../utils";
import { misc } from "../../../misc";

export const preferNumStr = utils.wrapRule(misc["no-restricted-syntax"], [
  {
    message: 'Prefer "NumStr" type',
    selector: [
      "TSUnionType[types.0.type=TSNumberKeyword][types.1.type=TSStringKeyword]",
      "TSUnionType[types.0.type=TSNumberKeyword][types.2.type=TSStringKeyword]",
      "TSUnionType[types.1.type=TSNumberKeyword][types.0.type=TSStringKeyword]",
      "TSUnionType[types.1.type=TSNumberKeyword][types.2.type=TSStringKeyword]",
      "TSUnionType[types.2.type=TSNumberKeyword][types.0.type=TSStringKeyword]",
      "TSUnionType[types.2.type=TSNumberKeyword][types.1.type=TSStringKeyword]"
    ]
  }
]);