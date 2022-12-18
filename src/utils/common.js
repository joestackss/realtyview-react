import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  format,
} from 'date-fns';

/**
 * Uppercase first letter of every word in a string
 * @param {string} str
 */
export function ucWords(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/**
 * Finds the difference in dates in human readable format
 * @param {Date} refDate
 * @param {Date} targetDate
 */
export function humanizedDatetime(targetDate, refDate=null) {
  if (refDate == null) refDate = new Date();
  const minutesDiff = differenceInMinutes(refDate, targetDate);
  const inFuture = minutesDiff < 0;
  if (minutesDiff === 0) return 'now';
  const hoursDiff = differenceInHours(refDate, targetDate);
  if (hoursDiff === 0) return inFuture ? `in ${-minutesDiff}m` : `${minutesDiff}m ago`;
  const daysDiff = differenceInDays(refDate, targetDate);
  if (daysDiff === 0) return inFuture ? `in ${-hoursDiff}h` : `${hoursDiff}h ago`;
  const weeksDiff = differenceInWeeks(refDate, targetDate);
  if (weeksDiff === 0) return inFuture ? `in ${-daysDiff}d` : `${daysDiff}d ago`;
  const monthsDiff = differenceInMonths(refDate, targetDate);
  if (monthsDiff === 0) return inFuture ? `in ${-weeksDiff}w` : `${weeksDiff}w ago`;
  return format(targetDate, 'MM/dd/yyyy');
}

export function compareString(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
