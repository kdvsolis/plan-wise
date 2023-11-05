const moment = require('moment');

function group_by_date(items) {
    let result = {};
    for (let item of items) {
        let start_date = item['start_date'];
        let frequency = item['frequency'];
        let duration = 365;
        let dates = generate_dates(start_date, frequency, duration);
        for (let date of dates) {
            if (date in result) {
                result[date].push(item);
            } else {
                result[date] = [item];
            }
        }
    }
    return result;
}

function generate_dates(start_date, frequency, duration) {
    let dates = [];
    let date = moment(start_date, 'YYYY-MM-DD');
    while (moment(date).diff(moment(start_date, 'YYYY-MM-DD'), 'days') <= duration) {
        dates.push(date.format('YYYY-MM-DD'));
        if (frequency === 0) {
            date.add(1, 'days');
        } else if (frequency === 1) {
            date.add(1, 'weeks');
        } else if (frequency === 2) {
            date.add(2, 'weeks');
        } else if (frequency === 3) {
            date.add(1, 'months');
        } else if (frequency === 4) {
            date.add(3, 'months');
        } else if (frequency === 5) {
            date.add(6, 'months');
        } else if (frequency === 6) {
            date.add(1, 'years');
        } else {
            return dates;
        }
    }
    return dates;
}

module.exports = { group_by_date, generate_dates };
