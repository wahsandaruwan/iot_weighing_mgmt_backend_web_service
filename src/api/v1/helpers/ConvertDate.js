const convertDateFormat = (inputDate) => {
    const parts = inputDate.split('.');
    
    // Ensure it's a valid date format (day.month.year)
    if (parts.length !== 3) {
        return 'Invalid date format';
    }
    
    let day = parts[0].replace(/^0+/, ''); // Remove leading zeros
    let month = parts[1].replace(/^0+/, ''); // Remove leading zeros
    const year = parts[2];
    
    // Create a new date string in the m/d/yyyy format
    const outputDate = `${month}/${day}/${year}`;
    
    return outputDate;
}

module.exports = { convertDateFormat };