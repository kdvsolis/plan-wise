package com.planwise.backend;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

public class DateDataGenerator {
    public static Map<String, List<Map<String, Object>>> groupByDate(List<Map<String, Object>> items) {
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        for (Map<String, Object> item : items) {
            Date startDate = (Date) item.get("start_date");
            int frequency = (int) item.get("frequency");
            int duration = 365;
            List<String> dates = generateDates(startDate, frequency, duration);
            for (String date : dates) {
                if (result.containsKey(date)) {
                    result.get(date).add(item);
                } else {
                    List<Map<String, Object>> itemList = new ArrayList<>();
                    itemList.add(item);
                    result.put(date, itemList);
                }
            }
        }
        return result;
    }

    public static List<String> generateDates(Date startDate, int frequency, int duration) {
        List<String> dates = new ArrayList<>();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        if (frequency == 7) { // One Time
            dates.add(formatter.format(calendar.getTime()));
            return dates;
        }
        for (int i = 0; i < duration; i++) {
            switch (frequency) {
                case 0: // Daily
                    calendar.add(Calendar.DATE, 1);
                    break;
                case 1: // Weekly
                    calendar.add(Calendar.DATE, 7);
                    break;
                case 2: // Every Other Week
                    calendar.add(Calendar.DATE, 14);
                    break;
                case 3: // Monthly
                    calendar.add(Calendar.MONTH, 1);
                    break;
                case 4: // Quarterly
                    calendar.add(Calendar.MONTH, 3);
                    break;
                case 5: // Every 6 Months
                    calendar.add(Calendar.MONTH, 6);
                    break;
                case 6: // Annually
                    calendar.add(Calendar.YEAR, 1);
                    break;
                default:
                    break;
            }
            dates.add(formatter.format(calendar.getTime()));
        }
        return dates;
    }    
}
