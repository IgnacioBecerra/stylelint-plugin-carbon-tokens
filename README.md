# stylelint-carbon-use

This project is intended to help users identify cases where tokens, functions and mixins defined as part of various projects relating to the Carbon Design System are used. [www.carbondesignsystem.com]

It consists of a stylelint plugin and depends on various Carbon Design System packages for loading settings.

It includes, but may not be limited to, linting for @carbon/themes, @carbon/colors, @carbon/layout, @carbon/type and @carbon/motion.

Not incluced, as they're not used through SCSS, are Carbon Icons, Grid and any other DOM related checks..

## Stylelint

Before you can use this stylelint plugin you will need to install and configure stylelint.

See https://www.npmjs.com/package/stylelint for details

NOTE: Just in case you were wondering, yes you can use comments to enable and disable the linter.
E.g. // stylelint-disable-next-line

## Installation

```bash
# NOT YET DEPLOYED TO NPM
# npm install @carbon/stylelint-carbon-use
npm install git+https://git@github.com/lee-chase/carbon-use.git
```

```bash
# NOT YET DEPLOYED TO NPM
# yarn add @carbon/stylelint-carbon-use
yarn add git+https://git@github.com/lee-chase/carbon-use.git
```

## Usage

Add it to your stylelint config `plugins` array.

```js
module.exports = {
  // stylelint.js
  // ...
  plugins: ["stylelint-carbon-use"],
  //...
};
```

Then add rules as follows:

```js
modules.exports = {
  // stylelint.js
  //...
  rules: {
    //... other rules
    "carbon/layout-token-use": true,
    "carbon/motion-token-use": [true, { severity: "warning" }],
    "carbon/theme-token-use": true,
    "carbon/type-token-use": true,
    //...other rules
  },
  //...
};
```

NOTE: Motion is shown above with a standard stylelint secondary option `severity` set to `warning` the default is `error`.

Each of the rules listed above have secondary options which are documented in the individual rule README.md files along with defaults..

[Layout token use](./layout-token-use/README.md)
[Motion token use](./motion-token-use/README.md)
[Theme token use](./theme-token-use/README.md)
[Type token use](./type-token-use/README.md)

### Common secondary options

These properties can be omitted to accept the defaults.

- includeProps
- ignoreValues

Accepts arrays of strings and/or Regex followed by a range in angled brackets.

The defaults for these are defined in the individual README files listed above.

- `includeProps: []` - Indicates default, same as omitting the property
- `includeProps: ["*"]` - Indicates default, same as omitting the property
- `includeProps: ["/^\\$my-color--/", "*"]` - SCSS variable starting "\$my-color--", plus default values specified

The last option here shows how you could elect to check your own tokens refer to values acceptable to the linter.

- `ignoreValues: ["$/^\\$my-color--/"]` - Ignore SCSS variables starting "\$my-color--"

NOTE: By default rules ignore SCSS and CSS variables not defined in the current prior to their use.

#### includeProps Range

Can innclude a range value expressed inside greater than and less than signs.

e.g. `["/prop-a$/<-1>", "/prop-b$/<1 -2>"]`

The above specifies the last value of `prop-a` and the first to second last of `prop-b`,

It can be applied either to regex or string values and allows values or a range of values to be selected from a multipart value.

The range value allows values to be selected from a multipart value such as a box-shadow.

- Positive values represent positions at the start of a value list e.g. 1 is the first value.
- Negative values represent positions at the end of a value list. e.g. -1 = last value

- If no range is specified the whole value list is checked as a single value.
- A single value means only that value in a list is checked
- Two values represent start and end values of a range in the list.

### Variables

SCSS `$variables` and CSS `--variable` declared before are checked
