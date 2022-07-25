import * as utils from "../../utils";
import { typescript } from "../../typescript";

export const trueAlwaysFalse = utils.wrapRule(typescript["restrict-syntax"], [
  {
    message: "Expecting type to include boolean or unknown",
    selector:
      "CallExpression[callee.object.name=/^(?:as|assert|is)$/u][callee.property.name=true] > .arguments:first-child",
    typeHasNoneOf: [
      utils.TypeGroup.any,
      utils.TypeGroup.boolean,
      utils.TypeGroup.unknown
    ]
  }
]);
