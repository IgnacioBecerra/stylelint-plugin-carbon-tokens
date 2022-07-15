/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { version } from "@carbon/motion/package.json";

const doInit = async (testOnlyVersion) => {
  const baseTokens = ["ease-in", "ease-out", "standard-easing"];
  const motionFunctions = ["motion"];
  let motionTokens;

  const _version = testOnlyVersion || version;
  const isV10 = _version.startsWith("10");

  if (isV10 && process.env.NODE_ENV === "test") {
    motionFunctions.push("carbon--motion");

    motionTokens = baseTokens.map((token) => `$carbon--${token}`);
  } else {
    motionTokens = baseTokens.map((token) => `$${token}`);
  }

  return { motionTokens, motionFunctions, version: _version };
};

export { doInit };
