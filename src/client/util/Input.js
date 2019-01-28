import isAlpha from "validator/lib/isAlpha";
import isLength from "validator/lib/isLength";

// export const clean = input => {
//   return $("<div/>")
//     .text(input)
//     .html();
// };

export const isValid = input => {
  return !(!input || input === "" || input.length < 3 || input.length > 15);
};


export const isValidName = name => {
  if (!isAlpha(name) || !isLength(name, { min: 3, max: 15 })) {
    return false;
  }
  return true;
};
