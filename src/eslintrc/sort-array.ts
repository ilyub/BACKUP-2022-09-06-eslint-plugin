import * as utils from "../utils";
import { misc } from "../misc";

export const sortArray = utils.wrapRule(misc["sort-array"], [
  {
    selector: [
      "Property[key.name=overrides] > ArrayExpression > ObjectExpression > Property[key.name=files] > ArrayExpression",
      "Property[key.value=/@skylib\\u002F/u] > ArrayExpression > ObjectExpression > Property[key.name=/^(?:allow|disallow|ignoreSelector|pattern|propertyPattern|selector)$/u] > ArrayExpression"
    ],
    triggerByComment: false
  }
]);
