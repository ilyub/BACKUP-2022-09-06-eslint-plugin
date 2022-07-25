import { preferClearInterval } from "./prefer-clearInterval";
import { preferClearTimeout } from "./prefer-clearTimeout";
import { preferSetInterval } from "./prefer-setInterval";
import { preferSetTimeout } from "./prefer-setTimeout";

export const programFlow = {
  "prefer-clearInterval": preferClearInterval,
  "prefer-clearTimeout": preferClearTimeout,
  "prefer-setInterval": preferSetInterval,
  "prefer-setTimeout": preferSetTimeout
} as const;
