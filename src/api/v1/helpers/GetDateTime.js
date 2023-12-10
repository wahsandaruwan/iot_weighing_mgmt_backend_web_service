const getDateTime = (inputDate) => {
  // Get current date
  const currentDate = new Date();

  // Set the options for formatting the date
  const options = {
    timeZone: "Asia/Colombo", // Set the timezone to Singapore
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Set to 24-hour format
  };

  // Format date and time separately
  const singaporeDate = currentDate.toLocaleDateString("en-US", options);
  const singaporeTime = currentDate.toLocaleTimeString("en-US", options);

  return {
    date: singaporeDate,
    time: singaporeTime,
  };
};

module.exports = { getDateTime };
