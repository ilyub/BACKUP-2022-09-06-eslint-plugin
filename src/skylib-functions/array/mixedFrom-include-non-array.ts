/* eslint-disable @skylib/consistent-filename -- Ok */

import * as utils from "../../utils";
import { typescript } from "../../typescript";

export const mixedFromIncludeNonArray = utils.wrapRule(
  typescript["restrict-syntax"],
  [
    {
      message: "Expecting type to include array",
      selector:
        "CallExpression[callee.object.name=a][callee.property.name=fromMixed] > .arguments:first-child",
      typeHasNoneOf: [
        utils.TypeGroup.boolean,
        utils.TypeGroup.function,
        utils.TypeGroup.number,
        utils.TypeGroup.object,
        utils.TypeGroup.string,
        utils.TypeGroup.symbol
      ]
    }
  ]
);
