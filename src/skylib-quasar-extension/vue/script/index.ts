import * as utils from "../../../utils";
import { consistentExposeArg } from "./consistent-expose-arg";
import { noGlobalIcons } from "./no-global-icons";
import { noGlobalLang } from "./no-global-lang";
import { requirePropTypeParam } from "./require-prop-type-param";
import { requireValidateEmitTypeParam } from "./require-validateEmit-type-param";
import { requireValidatePropsTypeParam } from "./require-validateProps-type-param";

export const script = utils.prefixKeys("script/", {
  "consistent-expose-arg": consistentExposeArg,
  "no-global-icons": noGlobalIcons,
  "no-global-lang": noGlobalLang,
  "require-prop-type-param": requirePropTypeParam,
  "require-validateEmit-type-param": requireValidateEmitTypeParam,
  "require-validateProps-type-param": requireValidatePropsTypeParam
});