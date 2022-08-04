/* eslint-disable @skylib/consistent-filename -- Ok */

import * as utils from "../utils";
import { typescript } from "../typescript";

export const noToThrowLiteral = utils.wrapRule(typescript["restrict-syntax"], [
  {
    message: "String argument is not allowed",
    selector: "CallExpression[callee.property.name=toThrow] > .arguments",
    typeIs: utils.TypeGroup.string
  }
]);