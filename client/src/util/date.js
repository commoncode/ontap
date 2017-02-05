/**
 * date utils
 */


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const dayMonth = (str) => {
  const date = new Date(str);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const daysDiff = (str1, str2) => {
  if (!str1 || !str2) return '';
  const diff = new Date(str2) - new Date(str1);
  const diffDays = diff / 1000/ 60 / 60 / 24;
  return Math.floor(diffDays);
};
