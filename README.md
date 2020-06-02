# stylelint-carbon-use

This project is intended to help users identify cases where tokens, functions and mixins defined as part of various projects relating to the Carbon Design System are used. [www.carbondesignsystem.com]

This includes, but may not be limited to, @carbon/themes, @carbon/colors, @carbon/layout, @carbon/type.

Not incluced, as they're not used through SCSS, are Carbon Icons, Grid and any other DOM related checks..

## Installation

```bash
# NOT YET DEPLOYED
# npm install @carbon/stylelint-carbon-use
```

## Usage

Add it to your stylelint config `plugins` array, then add `"carbon-use"` to your rules,
specifying the property for which you want to check the usage of variable.

Like so:

```js
{
  "plugins": [
    "stylelint-carbon-use"
  ],
  "rules": {
    "carbon/theme-token-use": [
    {
      // include standard color properites
      includeProps: ["/color$/", "/shadow$/", "border", "outline"],
      // ignore transparent, common reset values and 0 on its own
      ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
      // accept carbon tokens from @carbon/color
      acceptCarbonColorTokens: false,
      // accept IBM color tokens from @carbon/color
      acceptIBMColorTokens: false,
    },
  ]",
  }
}
```

### ignoreValues and includeProps

Accept an array of strings and/or Regex.

Other valid values for use in ignoreValues and includeProps are:

- [] which indicates default values specified internally
- ["*"] also indicates default values specified internally
- ["a", "*"] "a" plus default values specified internally

You can also check variables which is probably best done if you have a naming convention for color variables.

E.g. This checks dollar variables which contain the word 'color' or 'colour'.

- includeProps: ["*", "/^\\$.*colou?r.*$/"],

Defaults, if no options specified:

```js
const defaultOptions = {
  // include standard color properites
  includeProps: ["/color$/", "/shadow$/", "border", "outline"],
  // ignore transparent, common reset values and 0 on its own
  ignoreValues: ["/transparent|inherit|initial/", "/^0$/"],
  acceptCarbonColorTokens: false,
  acceptIBMColorTokens: false,
};
```

### acceptCarbonColorTokens

Default is false, permits color tokens from @carbon/color/scss mixin carbon--colors.

### acceptIBMColorTokens

Default is false, permits color tokens from @carbon/color/scss mixin ibm--colors.

## Details

Carbon components has tokens for use with color, theming, timing, spacing, typography etc. Use this linter in order to encourage / verify thier use.

```scss
$ui-01: #f4f4f4;

.foo {
  color: #f4f4f4; // Ooh, that's not a carbon token 👋
}
```

### Supports variables

Variables declared in the current file before use.

```scss
// Simple variables declared before use
$ui-01: #f4f4f4;
$som-carbon-token = $ui-01;
color: $some-carbon-token;

// css simple variables declared before use
$ui-01: #f4f4f4;
--my-var: $ui-01
color: var(--my-var);

// Using carbon functions
background-color: get-light-value($ui-01);
```
