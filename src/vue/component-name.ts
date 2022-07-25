import * as utils from "../utils";
import { misc } from "../misc";

export const componentName = utils.wrapRule(misc["match-filename"], [
  {
    format: utils.casing.Format.kebabCase,
    selector:
      "CallExpression[callee.name=defineComponent] > ObjectExpression > Property[key.name=name] > Literal.value"
  }
]);
