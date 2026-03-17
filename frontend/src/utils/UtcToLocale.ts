export const converUtcToLocaleDate = (utcDate: string, localTimeZone: string) => {
  const utc = new Date(utcDate);
  const local = utc.toLocaleDateString('en-US', { timeZone: localTimeZone });
  return local;
};

export const converUtcToLocalTime = (utcDate: string, localTimeZone: string) => {
  const utc = new Date(utcDate);
  const local = utc.toLocaleTimeString('en-US', { timeZone: localTimeZone });
  return local;
};
