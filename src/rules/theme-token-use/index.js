/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  checkRule,
  getMessages,
  isValidOption,
  namespace,
  parseOptions
} from "../../utils";
import { getThemeInfo } from "./utils";
import { utils } from "stylelint";

export const ruleName = namespace("theme-token-use");
export const messages = getMessages(ruleName, "theme");

const isValidAcceptValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard color properites
  includeProps: [
    "/color$/",
    "/shadow$/<-1>",
    "border<-1>",
    "outline<-1>",
    "fill",
    "stroke"
  ],
  // Accept transparent, common reset values and 0 on its own
  acceptValues: [
    "/inherit|initial|none|unset/",
    "/^0$/",
    "/currentColor|transparent/"
  ],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokensCarbonV10Only: false,
  acceptUndefinedVariables: false,
  acceptScopes: ["theme"],
  testOnlyTarget: undefined
};

export default function rule(primaryOptions, secondaryOptions) {
  const options = parseOptions(secondaryOptions, defaultOptions);

  return async (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOptions
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidIncludeProps],
          acceptValues: [isValidAcceptValues],
          acceptScopes: [isValidAcceptValues],
          acceptCarbonColorTokens: (val) =>
            val === undefined || typeof val === "boolean",
          acceptIBMColorTokensCarbonV10Only: (val) =>
            val === undefined || typeof val === "boolean",
          acceptUndefinedVariables: (val) =>
            val === undefined || typeof val === "boolean",
          testOnlyTarget: (val) =>
            val === undefined || ["v10", "v11"].includes(val)
        },
        optional: true
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    await checkRule(root, result, ruleName, options, messages, getThemeInfo);
  };
}
