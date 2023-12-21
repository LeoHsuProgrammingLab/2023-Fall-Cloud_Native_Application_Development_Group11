
const toCorrectString = (date) => {
    const targetTimeZone = 'Asia/Taipei';
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, 
    });

    const formattedString = formatter.format(date);

    const [datePart, timePart] = formattedString.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = toCorrectString;
