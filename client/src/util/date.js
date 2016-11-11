/**
 * date utils
 */


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const dayMonth = (str) => {
  const date = new Date(str);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};
