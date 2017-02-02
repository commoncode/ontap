/**
 * Utils
 */

export const calcStandardDrinks = (abv, litres = 0.500) => {
  // http://www.alcohol.gov.au/internet/alcohol/publishing.nsf/content/standard
  const ethanol = 0.789;
  const result = litres * abv * ethanol;
  return Math.round(result * 100) / 100;
};
