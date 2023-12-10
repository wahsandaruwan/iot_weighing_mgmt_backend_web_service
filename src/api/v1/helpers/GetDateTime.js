const getDateTime = () => {
  // Get current date
  const currentDate = new Date();

  // Set the options for formatting the date
  const options = {
    timeZone: "Asia/Singapore", // Set the timezone to Singapore
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Set to 24-hour format
  };

  // Format date and time to Singapore timezone in 24-hour format
  const singaporeDateTime = currentDate.toLocaleString("en-US", options);

  // Splitting date and time based on the comma
  const [datePart, timePart] = singaporeDateTime.split(", ");

  return {
    date: datePart,
    time: timePart,
  };
};

module.exports = { getDateTime };
