import { format, subMonths, addMonths } from 'date-fns';
import { nl } from 'date-fns/locale';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export interface PeriodInfo {
  id: string; // e.g. "Maart 2026"
  periodName: string; // e.g. "Maart"
  year: number;
  openDate: Date;
  closeDate: Date;
  targetMonthDate: Date;
}

/**
 * Returns the PeriodInfo for a specific target month date.
 */
export function getPeriod(targetMonthDate: Date): PeriodInfo {
  const startMonthName = format(targetMonthDate, 'MMMM', { locale: nl }).toLowerCase();
  
  const submissionMonthDate = addMonths(targetMonthDate, 1);
  const endMonthName = format(submissionMonthDate, 'MMMM', { locale: nl }).toLowerCase();
  const subYear = submissionMonthDate.getFullYear();
  const subMonth = submissionMonthDate.getMonth() + 1; // 1-12

  // Ensure these boundaries exactly represent Amsterdam time
  const pad = (n: number) => String(n).padStart(2, '0');
  const openDateStr = `${subYear}-${pad(subMonth)}-15 00:00:00`;
  const closeDateStr = `${subYear}-${pad(subMonth)}-20 23:59:59`;
  
  const openDate = fromZonedTime(openDateStr, 'Europe/Amsterdam');
  const closeDate = fromZonedTime(closeDateStr, 'Europe/Amsterdam');

  const periodId = `15 ${startMonthName} t/m 14 ${endMonthName}`;

  return {
    id: periodId,
    periodName: periodId,
    year: subYear,
    openDate,
    closeDate,
    targetMonthDate
  };
}

/**
 * The business logic: A "Month Cycle" runs from the 20th of the previous month to the 20th of the current month.
 */
export function getCurrentPeriodInfo(date: Date = new Date()): PeriodInfo {
  const amsterdamDate = toZonedTime(date, 'Europe/Amsterdam');
  const currentDay = amsterdamDate.getDate();
  
  let targetMonthDate: Date;
  if (currentDay <= 20) {
    targetMonthDate = subMonths(amsterdamDate, 1);
  } else {
    targetMonthDate = amsterdamDate;
  }

  return getPeriod(targetMonthDate);
}

export function getNextPeriodInfo(currentPeriod: PeriodInfo): PeriodInfo {
  const nextTarget = addMonths(currentPeriod.targetMonthDate, 1);
  return getPeriod(nextTarget);
}

/**
 * Gets all period strings up to the current active period for fixed contract workers
 */
export function getPastPeriods(startDate: Date, currentDate: Date = new Date()): string[] {
  const periods: string[] = [];
  let iter = startDate;
  
  const currentInfo = getCurrentPeriodInfo(currentDate);
  const maxKey = currentInfo.id;
  
  let count = 0;
  while (count < 24) {
    const info = getCurrentPeriodInfo(iter);
    const key = info.id;
    if (!periods.includes(key)) {
       periods.push(key);
    }
    
    if (key === maxKey) break;

    iter = addMonths(iter, 1);
    count++;
  }

  return periods.reverse();
}

/**
 * A handy hook/helper for calculating the countdown visually
 */
export function getCountdownString(targetDate: Date, now: Date): string {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "Nu open";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  if (days > 0) {
    return `${days}d ${hours}u`;
  }
  return `${hours}u ${minutes}m`;
}
