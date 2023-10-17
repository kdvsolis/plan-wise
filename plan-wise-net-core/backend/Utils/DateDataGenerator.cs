using System;
using System.Collections.Generic;

namespace backend.Utils
{
    public class ItemExpense
    {
        public DateTime start_date { get; set; }
        public int expense_id { get; set; }
        public string expenses { get; set; }
        public int frequency { get; set; }
        public decimal amount { get; set; }
        public int category { get; set; }

    }

    public class DateDataGenerator
    {
        public static Dictionary<DateTime, List<ItemExpense>> GroupByDate(List<ItemExpense> items)
        {
            var result = new Dictionary<DateTime, List<ItemExpense>>();
            foreach (var item in items)
            {
                var dates = GenerateDates(item.start_date, item.frequency, 365);
                foreach (var date in dates)
                {
                    if (!result.ContainsKey(date))
                    {
                        result[date] = new List<ItemExpense>();
                    }
                    result[date].Add(item);
                }
            }
            return result;
        }

        public static List<DateTime> GenerateDates(DateTime startDate, int frequency, int duration)
        {
            var dates = new List<DateTime>();
            var date = startDate;
            while ((date - startDate).TotalDays <= duration)
            {
                dates.Add(date);
                switch (frequency)
                {
                    case 0:
                        date = date.AddDays(1);
                        break;
                    case 1:
                        date = date.AddDays(7);
                        break;
                    case 2:
                        date = date.AddDays(14);
                        break;
                    case 3:
                        date = date.AddMonths(1);
                        break;
                    case 4:
                        date = date.AddMonths(3);
                        break;
                    case 5:
                        date = date.AddMonths(6);
                        break;
                    case 6:
                        date = date.AddYears(1);
                        break;
                    default:
                        return dates;
                }
            }
            return dates;
        }
    }

}
