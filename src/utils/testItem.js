/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isVariable, parseRangeValue } from ".";
import { TOKEN_TYPES } from "./tokenizeValue";

const checkTokens = function (variable, ruleInfo) {
  const result = { accepted: false, done: false };

  // cope with variables wrapped in #{}
  const _variable =
    variable.startsWith("#{") && variable.endsWith("}")
      ? variable.substr(2, variable.length - 3)
      : variable;

  for (const tokenSet of ruleInfo.tokens) {
    const tokenSpecs = tokenSet.values;

    if (tokenSpecs.includes(_variable)) {
      result.source = tokenSet.source;
      result.accepted = tokenSet.accept;
      result.done = true; // all tests completed
      break;
    }
  }

  return result;
};

const checkProportionalMath = (mathItems, ruleInfo) => {
  let otherItem;

  if (
    mathItems[0].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[0].units) > -1
  ) {
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    ["vw", "vh", "%"].indexOf(mathItems[2].units) > -1
  ) {
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["+", "-"].indexOf(mathItems[1].value) > -1) {
      // is plus or minus
      return checkTokens(otherItem.raw, ruleInfo);
    }
  }

  return {};
};

const checkNegation = (mathItems, ruleInfo) => {
  let otherItem;
  let numeric;

  if (
    mathItems[0].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[0].units === ""
  ) {
    numeric = mathItems[0];
    otherItem = mathItems[2];
  } else if (
    mathItems[2].type === TOKEN_TYPES.NUMERIC_LITERAL &&
    mathItems[2].units === ""
  ) {
    numeric = mathItems[2];
    otherItem = mathItems[0];
  }

  if (otherItem !== undefined) {
    if (["*", "/"].indexOf(mathItems[1].value) > -1 && numeric.raw === "-1") {
      // is times or divide by -1
      return checkTokens(otherItem.raw, ruleInfo);
    }
  }

  return {};
};

const testItemInner = function (item, ruleInfo) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  const result = {
    accepted: false,
    done: false,
  };

  if (item === undefined) {
    // do not accept undefined
    result.done = true;

    return result;
  }

  // cope with css variables
  const _item =
    item.type === TOKEN_TYPES.FUNCTION && item.value === "var"
      ? item.items[0]
      : item;

  if (_item.type === TOKEN_TYPES.FUNCTION) {
    for (const funcSet of ruleInfo.functions) {
      const funcSpecs = funcSet.values;

      const matchesFuncSpec = funcSpecs.some((funcSpec) => {
        const parts = funcSpec.split("(");

        if (parts.length === 1) {
          // no parameter checks
          return parts[0] === _item.value;
        } else {
          // check parameters
          if (parts[0] === _item.value) {
            // a function will contain an items array that is either a LIST or not
            // IF TRUE a list then _item.items[0] === list which contains LIST_ITEMS in which case LIST_ITEMS.items is what we are interested in
            // IF FALSE a list contains values which could include math or brackets or function calls
            // NOTE: we do not try to deal with function calls inside function calls

            const inList = !!(
              _item.items && _item.items[0].type === TOKEN_TYPES.LIST
            );
            const paramItems = inList
              ? _item.items[0].items // List[0] contains list items
              : _item.items; // otherwise contains Tokens

            let [start, end] = parts[1]
              .substring(0, parts[1].length - 1)
              .split(" ");

            start = parseRangeValue(start, paramItems.length);
            end = parseRangeValue(end, paramItems.length) || start; // start if end empty

            for (let pos = start; pos <= end; pos++) {
              if (!paramItems[pos]) {
                break; // ignore parts after undefined
              }

              // raw value of list and non-list item does allow for math
              let tokenResult = {};

              if (_item.isCalc && paramItems[pos].type === TOKEN_TYPES.MATH) {
                // allow proportional + or - checkTokens
                const mathItems = paramItems[pos].items;

                tokenResult = checkProportionalMath(mathItems, ruleInfo);

                if (!tokenResult.accepted) {
                  tokenResult = checkNegation(mathItems, ruleInfo);
                }
              } else {
                tokenResult = checkTokens(paramItems[pos].raw, ruleInfo);
              }

              if (!tokenResult.accepted) {
                return false;
              }
            }

            // all variables in function passed so return true
            return true;
          } else {
            return false;
          }
        }
      });

      if (matchesFuncSpec) {
        result.source = funcSet.source;
        result.accepted = funcSet.accept;
        result.done = true; // all tests completed
        break;
      }
    }
  } else if (item.type === TOKEN_TYPES.MATH) {
    const tokenResult = checkNegation(item.items, ruleInfo);

    result.source = tokenResult.source;
    result.accepted = tokenResult.accepted;
    result.done = tokenResult.done;
  } else if (_item.type === TOKEN_TYPES.SCSS_VAR) {
    const tokenResult = checkTokens(_item.value, ruleInfo);

    result.source = tokenResult.source;
    result.accepted = tokenResult.accepted;
    result.done = tokenResult.done;
  }

  // if (
  //   !result.accepted &&
  //   item &&
  //   (item.startsWith("carbon--mini-units") ||
  //     item.startsWith("get-light-item"))
  // ) {
  //   // eslint-disable-next-line
  //   console.log(
  //     result,
  //     item,
  //     matches,
  //     matches && matches[matchFunction],
  //     matches && matches[matchFunction].length > 0,
  //     regexFuncAndItem
  //   );
  // }

  result.isCalc = _item.isCalc;

  return result;
};

export default function testItem(item, ruleInfo, options, knownVariables) {
  // Expects to be passed an item containing either a item { raw, type, value} or
  // one of the types with children Math, Function or Bracketed content { raw, type, items: [] }
  let result = {};

  if (item === undefined) {
    // do not accept undefined
    result.done = true;

    return result;
  }

  let testItem = item;

  result.done = false;
  while (testItem && !result.done) {
    // loop checking testItem;
    result = testItemInner(testItem, ruleInfo);

    if (!result.done && isVariable(testItem)) {
      // may be a variable referring to a item
      testItem = knownVariables[testItem.raw];

      if (!testItem) {
        if (options.acceptUndefinedVariables) {
          result.accepted = true;
        }

        result.done = true;
      }
    } else {
      result.done = true;
    }
  }

  result.isVariable = isVariable(item); // causes different result message
  result.variableItem = testItem; // last testItem found

  // if (result.isCalc) {
  //   // eslint-disable-next-line
  //   console.log("We have calc", item.raw);
  // }

  return result;
}
