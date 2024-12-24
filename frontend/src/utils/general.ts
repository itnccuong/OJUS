export const longReadableTimeConverter = (time: string) => {
  const date = new Date(time);

  return date.toLocaleString("en-US", {
    weekday: "long", // e.g., "Friday"
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "December"
    day: "numeric", // e.g., "6"
    hour: "numeric", // e.g., "8 AM"
    minute: "numeric", // e.g., "57"
    second: "numeric", // e.g., "20"
    hour12: true, // 12-hour clock (AM/PM)
  });
};

export const shortReadableTimeConverter = (time: string) => {
  const date = new Date(time);

  return date.toLocaleString("en-US", {
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "December"
    day: "numeric", // e.g., "6"
  });
};
