import * as utils from "../utils";
import { core } from "./core";

export const noThisVoid = utils.wrapRule(core["restrict-syntax"], [
  {
    message: 'Use arrow function instead of "this: void"',
    selector:
      "Identifier[name=this][typeAnnotation.typeAnnotation.type=TSVoidKeyword]"
  }
]);