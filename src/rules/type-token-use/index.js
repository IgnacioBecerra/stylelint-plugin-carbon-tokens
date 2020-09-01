// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import {
  isValidOption,
  namespace,
  parseOptions,
  checkRule,
  getMessages,
} from "../../utils";
import { getTypeInfo } from "./utils";

export const ruleName = namespace("type-token-use");
export const messages = getMessages(ruleName, "type");

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard type properites
  includeProps: ["font", "/^font-*/", "line-height", "letterSpacing"],
  ignoreValues: ["/inherit|initial|none|unset/"],
  acceptCarbonFontWeightFunction: false, // permit use of carbon font weight function
  acceptCarbonTypeScaleFunction: false, // permit use of carbon type scale function
};

export default function rule(primaryOptions, secondaryOptions) {
  const options = parseOptions(secondaryOptions, defaultOptions);

  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOptions,
      },
      {
        actual: options,
        possible: {
          includeProps: [isValidIncludeProps],
          ignoreValues: [isValidIgnoreValues],
          acceptCarbonFontWeightFunction: (val) =>
            val === undefined || typeof val === "boolean",
          acceptCarbonTypeScaleFunction: (val) =>
            val === undefined || typeof val === "boolean",
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    checkRule(root, result, ruleName, options, messages, getTypeInfo);
  };
}
