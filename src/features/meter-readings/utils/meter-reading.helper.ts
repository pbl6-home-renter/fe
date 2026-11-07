export const getPreviousPeriod = (period: string): string => {
  const [yearStr, monthStr] = period.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  month -= 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${month.toString().padStart(2, '0')}`;
};

export const getNextPeriod = (period: string): string => {
  const [yearStr, monthStr] = period.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  return `${year}-${month.toString().padStart(2, '0')}`;
};

export const getCurrentPeriod = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

export const calculateConsumption = (current?: string, previous?: string): string => {
  if (!current || !previous) return '0';
  const c = parseFloat(current);
  const p = parseFloat(previous);
  if (isNaN(c) || isNaN(p) || c < p) return '0';
  const diff = c - p;
  return Math.round(diff * 100) / 100 + '';
};
