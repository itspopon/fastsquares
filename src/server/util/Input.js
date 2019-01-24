exports.isValidInput = input => {
  return !(!input || input === "" || input.length < 3 || input.length > 15);
};