const LEVEL = 3;

exports.log = (level, message) => {
  if (level >= LEVEL) {
    console.log(message);
  }
};

exports.warn = (level, message) => {
  if (level >= LEVEL) {
    console.warn(message);
  }
};

exports.log = (level, message) => {
  if (level >= LEVEL) {
    console.error(message);
  }
};

const args = (expected, received) => {
  console.warn(
    `${args.caller} expected ${expected.length} arguments but received ${
      received.length
    }`
  );
};

exports.args = args;
