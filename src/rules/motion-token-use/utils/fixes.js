/**
 * Copyright IBM Corp. 2022, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { fixUsingMap } from "../../../utils/fixUsingMap";

export const fixes = [
  {
    // remove carbon prefix from spacing tokens
    version: "v11",
    target: /\$(duration--)?((fast)|(moderate)|(slow))-([0-2]{2})/g,
    replacement: "$$duration-$2-$6"
  },
  {
    // remove carbon prefix for easings
    version: "v11",
    target: /\$(carbon--)((ease-in)|(ease-out)|(standard-easing)|(easings))/g,
    replacement: "$$$2"
  },
  {
    // remove carbon prefix for motion function
    version: "v11",
    target: /carbon--motion/g,
    replacement: "motion"
  },
  {
    // replace matching motion duration literal
    version: "v11",
    target: /[0-9]*ms/g,
    replacement: (value, target) => {
      return fixUsingMap(value, target, {
        "70ms": "$duration-fast-01",
        "110ms": "$duration-fast-02",
        "150ms": "$duration-moderate-01",
        "240ms": "$duration-moderate-02",
        "400ms": "$duration-slow-01",
        "700ms": "$duration-slow-02"
      });
    }
  }
];
