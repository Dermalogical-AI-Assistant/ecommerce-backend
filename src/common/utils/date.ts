import * as dayjs from 'dayjs';

export function getDateNow() {
  return dayjs().toDate();
}

export function getStartEndCurrentMonth() {
  const now = dayjs();
  const startOfCurrentMonth = now.startOf('month').toDate();
  const endOfCurrentMonth = now.endOf('month').toDate();

  return { startOfCurrentMonth, endOfCurrentMonth };
}
