export const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.ceil((millis % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds.toFixed(0);
};
