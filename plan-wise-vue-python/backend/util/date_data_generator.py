from datetime import datetime
from dateutil.relativedelta import relativedelta

def group_by_date(items):
    result = {}
    for item in items:
        start_date = item['start_date']
        frequency = item['frequency']
        duration = 365
        dates = generate_dates(start_date, frequency, duration)
        for date in dates:
            if date in result:
                result[date].append(item)
            else:
                result[date] = [item]
    return result

def generate_dates(start_date, frequency, duration):
    dates = []
    date = datetime.strptime(start_date, '%Y-%m-%d')
    while (date - datetime.strptime(start_date, '%Y-%m-%d')).days <= duration:
        dates.append(date.strftime('%Y-%m-%d'))
        if frequency == 0:
            date += relativedelta(days=1)
        elif frequency == 1:
            date += relativedelta(weeks=1)
        elif frequency == 2:
            date += relativedelta(weeks=2)
        elif frequency == 3:
            date += relativedelta(months=1)
        elif frequency == 4:
            date += relativedelta(months=3)
        elif frequency == 5:
            date += relativedelta(months=6)
        elif frequency == 6:
            date += relativedelta(years=1)
        else:
            return dates
    return dates
