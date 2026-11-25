/**
 * Formats occupancy rate percentage with locale support.
 * Example for 62.5:
 * - locale 'vi' -> '62,5%'
 * - locale 'en' -> '62.5%'
 */
export function formatOccupancyRate(rate: number | null | undefined, locale = 'vi'): string {
  if (rate === null || rate === undefined || Number.isNaN(rate)) {
    return '0%';
  }
  const langTag = locale.startsWith('en') ? 'en-US' : 'vi-VN';
  const formatted = new Intl.NumberFormat(langTag, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(rate);

  return `${formatted}%`;
}
