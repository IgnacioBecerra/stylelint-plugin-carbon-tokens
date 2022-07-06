/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { utils } from "stylelint";

const getMessages = (ruleName, label) => {
  return utils.ruleMessages(ruleName, {
    rejected: (property, value) =>
      `Expected carbon ${label} token, mixin or function for "${property}" found "${value}".`,
    rejectedUndefinedRange: (property, value, range) =>
      `Expected carbon ${label} token, mixin or function for "${property}" found "${value}" in position(s) "${range}".`,
    rejectedVariable: (property, variable, value) =>
      `Expected carbon ${label} token, mixin or function to be set for variable "${variable}" used by "${property}" found "${value}".`,
    rejectedMaths: (property, value) =>
      `Expected calc of the form calc(P O #{$}) or calc(-1 * #{$}). Where 'P' is in (vw, vh or %), 'O' is + or -,  '$' is a carbon ${label} token, mixin or function for "${property}" found "${value}".`,
    rejectedTransition: (property, value) =>
      `Expected carbon ${label} token or function in position 2 for "${property}" found "${value}".`,
    rejectedAnimation: (property, value) =>
      `Expected carbon ${label} token or function in position 2 for "${property}" found "${value}".`
  });
};

export default getMessages;
