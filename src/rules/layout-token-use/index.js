// import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { isValidOption, namespace, parseOptions, checkRule } from "../../utils";
import { checkLayoutValue } from "./utils";

export const ruleName = namespace("layout-token-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Expected carbon layout token or function for "${property}" found "${value}.`,
  rejectedVariable: (property, variable, value) =>
    `Expected carbon layout token or function to be set for variable "${variable}" used by "${property}" found "${value}.`,
});

const isValidIgnoreValues = isValidOption;
const isValidIncludeProps = isValidOption;

const defaultOptions = {
  // include standard color properites
  includeProps: [
    "/^margin/<1 4>",
    "/^padding/<1 4>",
    "height",
    "width",
    "left",
    "top",
    "bottom",
    "right",
  ],
  // ignore transparent, common reset values, 0, proportioanl values,
  ignoreValues: ["/inherit|initial/", "/^0[a-z]*$/", "/^[0-9]*(%|vw|vh)$/"],
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
        },
        optional: true,
      }
    );

    if (!validOptions) {
      /* istanbul ignore next */
      return;
    }

    checkRule(root, result, ruleName, options, messages, checkLayoutValue);
  };
}
