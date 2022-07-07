/**
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { transition: none; }",
      description: "Accept reset using none"
    },
    {
      code: ".foo { transition: inherit; }",
      description: "Accept reset using inherit"
    },
    {
      code: ".foo { transition: initial; }",
      description: "Accept reset using initial"
    },
    {
      code: ".foo { transition: unset; }",
      description: "Accept reset using unset"
    },
    {
      code: ".foo { transition: width $duration-fast-01 linear ease-in; }",
      description: "Carbon motion token expected for transition."
    },
    {
      code: ".foo { transition-duration: $duration-moderate-01; }",
      description: "Carbon motion token expected for transition duration."
    },
    {
      code: ".foo { transition: width $duration-fast-02 linear ease-in, height $duration-moderate-01 ease-out; }",
      description: "Carbon motion token expected for split transitions."
    },
    {
      code: "$my-value-accept: $duration-fast-01; .foo { transition-duration: $my-value-accept; }",
      description:
        "Accept $variable declared before use with Carbon motion tokens."
    },
    {
      code: ".foo { animation: test $duration-fast-01 linear ease-in myAnim; }",
      description: "Carbon motion token expected for animation."
    },
    {
      code: "$test: 'test'; .foo { animation: $test $duration-fast-01 linear ease-in myAnim; }",
      description:
        "Carbon motion token expected for animation other token used a"
    },
    {
      code: ".foo { animation-duration: $duration-moderate-01; }",
      description: "Carbon motion token expected for animation duration."
    },
    {
      code: "--my-value-accept: $duration-moderate-01; .foo { animation-duration: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use for animation duration with Carbon motion tokens."
    }
  ],

  reject: [
    {
      code: ".foo { transition: all $my-value-accept; }",
      description: "Reject undeclared $variable by default in transition.",
      message: messages.expected
    },
    {
      code: ".foo { transition: all var(--my-value-accept); }",
      description: "Reject undeclared --variable by default.",
      message: messages.expected
    },
    {
      code: ".foo { animation: $my-value-accept myAnim; }",
      description: "Reject undeclared $variable by default in animation.",
      message: messages.expected
    },
    {
      code: ".foo { animation: test var(--my-value-accept) myAnim; }",
      description: "Reject undeclared --variable by default.",
      message: messages.expected
    },
    {
      code: ".foo { transition: $duration-fast-01; }",
      description: "Carbon motion token used in non-standard order.",
      message: messages.expected
    },
    {
      code: ".foo { animation: $duration-fast-01 test; }",
      description: "Carbon motion token used in non-standard order.",
      message: messages.expected
    },
    {
      code: ".foo { transition: all 2s; }",
      description: "Used non-token duration.",
      message: messages.expected
    },
    {
      code: ".foo { transition: width 99s linear ease-in, height $duration-fast-01 ease-out; }",
      description:
        "Used non-token in first split property not Carbon motion tokens.",
      message: messages.expected
    },
    {
      code: ".foo { transition: width $duration-fast-01 linear ease-in, height 2s ease-out; }",
      description:
        "Used non-token in non-first split property not Carbon motion tokens.",
      message: messages.expected
    }
  ]
});

// v10 test
testRule(rule, {
  ruleName,
  config: [true, { testOnlyTarget: "v10" }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: ".foo { transition: width $duration--fast-01 linear ease-in; }",
      description: "Carbon motion token expected for transition."
    },
    {
      code: ".foo { animation: test $duration--fast-01 linear ease-in myAnim; }",
      description: "Carbon motion token expected for animation."
    }
  ]
});

// verify rejection of undeclared variables
testRule(rule, {
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: "$my-value-accept: $duration-fast-01; .foo { transition-duration: $my-value-accept; }",
      description:
        "Accept $variable declared before use with Carbon motion tokens and acceptUndefinedVariables is false."
    },
    {
      code: "--my-value-accept: $duration-moderate-01; .foo { transition-duration: var(--my-value-accept); }",
      description:
        "Accept --variable declared before use with Carbon motion tokens and acceptUndefinedVariables is false."
    }
  ],

  reject: [
    // an ibm motion token
    {
      code: ".foo { transition: all $my-value-reject; }",
      description:
        "Reject undeclared $variable for transition when acceptUndefinedVariables is false.",
      message: messages.expected
    },
    {
      code: ".foo { animation: $my-value-reject myAnim; }",
      description:
        "Reject undeclared $variable for animation when acceptUndefinedVariables is false.",
      message: messages.expected
    },
    {
      code: ".foo { transition-duration: var(--my-value-reject); }",
      description:
        "Reject undeclared --variable for transition-duration when acceptUndefinedVariables is false.",
      message: messages.expected
    },
    {
      code: ".foo { animation-duration: var(--my-value-reject); }",
      description:
        "Reject undeclared --variable for animation-duration when acceptUndefinedVariables is false.",
      message: messages.expected
    }
  ]
});

// testConfig(rule, {
//   ruleName,
//   description: "Check for invalid accept values",
//   message: messages.expected,
//   config: ["always", { acceptValues: ["/wibble/"] }],
// });

// Scope tests
testRule(rule, {
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { animation-duration: motion.$duration-fast-01; }`,
      description: "Accept motion scope."
    }
  ],
  reject: [
    {
      code: `.foo { animation-duration: mo.$duration-fast-01; }`,
      description: "Reject scope 'mo' without acceptScopes setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["mo"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { animation-duration: mo.$duration-fast-01; }`,
      description: "Accept scope 'mo' with acceptScopes setting."
    },
    {
      code: `.foo { animation-duration: motion(mo.$duration-fast-01)}`,
      description: "Accept scope 'mo' with acceptScopes setting in function.."
    }
  ],
  reject: []
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["mo", "*"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { animation-duration: mo.$duration-fast-01; }`,
      description: "Accept scope 'mo' with acceptScopes setting."
    },
    {
      code: `.foo { animation-duration: motion(mo.$duration-fast-01)}`,
      description: "Accept scope 'mo' with acceptScopes setting in function."
    },
    {
      code: `.foo { animation-duration: motion.$duration-fast-01; }`,
      description: "Accept motion scope with scope setting including default."
    },
    {
      code: `.foo { animation-duration: motion(motion.$duration-fast-01)}`,
      description:
        "Accept motion scope in function with scope setting including default."
    }
  ],
  reject: [
    {
      code: `.foo { animation-duration: reject.$duration-fast-01; }`,
      description: "Reject scope not included in scope setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { acceptScopes: ["/^mo(tion)?$/"] }],
  customSyntax: "postcss-scss",
  accept: [
    {
      code: `.foo { animation-duration: mo.$duration-fast-01; }`,
      description: "Accept scope 'mo' with acceptScopes regex setting."
    },
    {
      code: `.foo { animation-duration: motion(mo.$duration-fast-01)}`,
      description:
        "Accept scope 'mo' with acceptScopes regex setting in function.."
    },
    {
      code: `.foo { animation-duration: motion.$duration-fast-01; }`,
      description:
        "Accept motion scope with scope regex setting including default."
    },
    {
      code: `.foo { animation-duration: motion(motion.$duration-fast-01)}`,
      description:
        "Accept motion scope in function with scope regex setting including default."
    }
  ],
  reject: [
    {
      code: `.foo { animation-duration: reject.$duration-fast-01; }`,
      description: "Reject scope not included in scope regex setting."
    }
  ]
});

testRule(rule, {
  ruleName,
  customSyntax: "postcss-scss",
  config: true,
  accept: [
    {
      code: `.foo { animation-timing-function: motion('standard', 'productive'); }`,
      description: "Accept Carbon motion function."
    }
  ],
  reject: [
    {
      code: `.foo { animation-timing-function: : carbon--motion('standard', 'productive');}`,
      description: "Reject carbon--motion removed in v11.",
      message: messages.expected
    }
  ]
});

testRule(rule, {
  ruleName,
  customSyntax: "postcss-scss",
  // config: true,
  config: [true, { testOnlyTarget: "v10" }],
  accept: [
    {
      code: `.foo { animation-timing-function: motion('standard', 'productive'); }`,
      description: "Accept Carbon motion function."
    },
    {
      code: `.foo { animation-timing-function: carbon--motion('standard', 'productive');}`,
      description: "Accept carbon--motion with carbon 10 switch."
    }
  ],
  reject: []
});
