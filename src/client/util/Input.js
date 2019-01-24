export const clean = input => {
  return $("<div/>")
    .text(input)
    .html();
};

export const isValid = input => {
  return !(!input || input == "" || input.length < 3 || input.length > 15);
};
