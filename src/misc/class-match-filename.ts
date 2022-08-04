import * as utils from "../utils";
import { core } from "./core";

export const classMatchFilename = utils.wrapRule(core["match-filename"], [
  {
    format: utils.casing.Format.pascalCase,
    selector: "ClassDeclaration > Identifier.id"
  }
]);