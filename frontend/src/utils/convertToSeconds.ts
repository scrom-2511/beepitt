export const convertToSeconds = (val: number, unit: string) => {
  if (unit === 'sec') return val;
  if (unit === 'minutes') return val * 60;
  if (unit === 'hours') return val * 3600;
  return val;
};
