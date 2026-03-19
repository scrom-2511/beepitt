export const convertFromSeconds = (seconds: number) => {
  if (seconds % 3600 === 0) {
    return { value: String(seconds / 3600), unit: 'hours' };
  }
  if (seconds % 60 === 0) {
    return { value: String(seconds / 60), unit: 'minutes' };
  }
  return { value: String(seconds), unit: 'sec' };
};
