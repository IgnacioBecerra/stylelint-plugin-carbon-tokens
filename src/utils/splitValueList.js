// This function tries to determine which parts of a value are to be checked and whether or not a value
// should be broken into chunks.

const parseRangeValue = (value, length) => {
  if (!value) {
    return value;
  }

  const _value = parseInt(value, 10);

  if (_value < 0) {
    // -ve from end

    return length + _value;
  } else {
    return _value;
  }
};

export default function splitValueList(value, propSpec) {
  // NOTE: inside function as otherwise regex.lastIndex may be non-zero on second call
  const commaSplitRegex = /,(?=(((?!\)).)*\()|[^()]*$)/g;
  const spaceSplitRegex = / (?=(((?!\)).)*\()|[^()]*$)/g;
  const commaSplitValues = [];
  let values;
  let lastPos = 0;
  let matches;

  // first split based on comma for values like box-shadow
  while ((matches = commaSplitRegex.exec(value)) !== null) {
    commaSplitValues.push(value.substring(lastPos, matches.index).trim());
    lastPos = commaSplitRegex.lastIndex;
  }

  if (lastPos < value.length) {
    commaSplitValues.push(value.substring(lastPos).trim());
  }

  if (propSpec.range) {
    // Next split on space and check against propSpec.range

    for (const commaSplitValue of commaSplitValues) {
      const spaceSplitValues = [];

      lastPos = 0;
      while ((matches = spaceSplitRegex.exec(commaSplitValue)) !== null) {
        spaceSplitValues.push(
          commaSplitValue.substring(lastPos, matches.index).trim()
        );
        lastPos = spaceSplitRegex.lastIndex;
      }

      if (lastPos < commaSplitValue.length) {
        spaceSplitValues.push(commaSplitValue.substring(lastPos).trim());
      }

      // for the range select only the values to check
      // 1 = first value, -1 = last value
      let [start, end] = propSpec.range.split(" ");

      start = parseRangeValue(start, spaceSplitValues.length);
      end = parseRangeValue(end, spaceSplitValues.length);

      if (end) {
        values = spaceSplitValues.slice(start, end + 1); // +1 to include last element
      } else {
        values = [spaceSplitValues[start]];
      }
    }
  } else {
    // any part can match
    values = commaSplitValues;
  }

  return values;
}
