const validate = {
  isInput: (text: string) => {
    if (text) return true;
    else return 'You didnt enter a valid string!';
  },
  isInt: (text: string) => {
    if (!isNaN(parseInt(text))) return true;
    else return 'You didnt enter a valid number!';
  },
  isFloat: (text: string) => {
    if (!isNaN(parseFloat(text))) return true;
    else return 'You didnt enter a valid number!';
  },
  isFullName: (text: string) => {
    if (text.includes(' ')) return true;
    else return 'You didnt enter a full name!';
  },
};

module.exports = validate;
