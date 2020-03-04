exports.ucs2decode = ucs2decode;

// JS stores strins internally as USC.
// Character values above 127 are stored as two characters
// Unfuck that.
function ucs2decode(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;
    while (counter < length) {
      value = string.charCodeAt(counter++);
      if ((value & 0xF800) == 0xD800 && counter < length) {
        extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) {
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          output.push(value, extra);
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  