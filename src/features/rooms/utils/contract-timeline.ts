export interface ContractTimelineResult {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  percent: number;
}

export const calculateContractTimeline = (
  startDateStr: string,
  endDateStr: string,
  currentTimestamp: number = Date.now(),
): ContractTimelineResult => {
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();

  const totalMs = Math.max(1, end - start);
  const elapsedMs = Math.max(0, Math.min(currentTimestamp - start, totalMs));
  const remainingMs = Math.max(0, end - Math.max(currentTimestamp, start));

  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  const percent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));

  return { totalDays, elapsedDays, remainingDays, percent };
};
