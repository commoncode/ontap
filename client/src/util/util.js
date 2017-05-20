/**
 * Utils
 */


// calculate standard drinks.
// defaults to 500ml because that's what our pint glasses are
export const calcStandardDrinks = (abv, litres = 0.500) => {
  // http://www.alcohol.gov.au/internet/alcohol/publishing.nsf/content/standard
  const ethanol = 0.789;
  const result = litres * abv * ethanol;
  return Math.round(result * 100) / 100;
};


// prepend a string with http:// if it needs it
const urlifyRegex = new RegExp('^http', 'gi');
export const urlify = str => str.match(urlifyRegex) ? str : `http://${str}`;
