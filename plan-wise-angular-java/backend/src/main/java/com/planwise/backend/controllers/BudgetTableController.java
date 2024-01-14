package com.planwise.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimeZone;
import java.math.*;
import java.text.SimpleDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/budget")
public class BudgetTableController {

    @Autowired
    private PwBudgetTableIncomeRepository budgetTableIncomeRepository;

    @Autowired
    private PwBudgetTableExpenseRepository budgetTableExpenseRepository;

    @Autowired
    private PwUserRepository userRepository;

    @PutMapping("/update_budgets")
    public ResponseEntity<Map<String, Object>> updateBudgets(@RequestBody BudgetRequest budget, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");

        try {
            // Update income
            for (Map<String, Object> income : budget.getIncome()) {
                Long id = Long.valueOf(income.get("id").toString());
                Optional<PwBudgetTableIncome> record = budgetTableIncomeRepository.findById(id);
                if (record.isPresent()) {
                    PwBudgetTableIncome updatedIncome = record.get();
                    updatedIncome.setAmount(new BigDecimal(income.get("amount").toString()));
                    updatedIncome.setDate(DateDataGenerator.parseDateString(income.get("date").toString()));
                    budgetTableIncomeRepository.save(updatedIncome);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid Request");
                    return ResponseEntity.status(400).body(response);
                }
            }

            // Update expenses
            for (Map<String, Object> expense : budget.getExpense()) {
                Long id = Long.valueOf(expense.get("id").toString());
                Optional<PwBudgetTableExpense> record = budgetTableExpenseRepository.findById(id);
                if (record.isPresent()) {
                    PwBudgetTableExpense updatedExpense = record.get();
                    updatedExpense.setAmount(new BigDecimal(expense.get("amount").toString()));
                    updatedExpense.setDate(DateDataGenerator.parseDateString(expense.get("date").toString()));
                    budgetTableExpenseRepository.save(updatedExpense);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid Request");
                    return ResponseEntity.status(400).body(response);
                }
            }

            response.put("success", true);
            response.put("message", "Budgets updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/get_budgets_in_date_range")
    public ResponseEntity<Map<String, Object>> getBudgetsInDateRange(@RequestParam(required = false) String start_date_str, HttpServletRequest request) {
        try{
            Map<String, Object> response = new HashMap<>();
            Integer user_id = (Integer) request.getAttribute("user_id");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            TimeZone tz = TimeZone.getTimeZone("UTC");
            sdf.setTimeZone(tz);
            sdf.setLenient(false);
            Date startDate;
            if (start_date_str != null) {
                startDate = sdf.parse(sdf.format(DateDataGenerator.parseDateString(start_date_str)));
            } else {
                Date earliestIncomeDate = budgetTableIncomeRepository.findEarliestDateByUserId(user_id);
                Date earliestExpenseDate = budgetTableExpenseRepository.findEarliestDateByUserId(user_id);
                startDate = earliestIncomeDate.before(earliestExpenseDate) ? earliestIncomeDate : earliestExpenseDate;
                startDate = DateDataGenerator.getFirstDayOfMonth(startDate);
            }
            Date endDate = sdf.parse(sdf.format(DateDataGenerator.getLastDayOfMonth(startDate)));
            List<PwBudgetTableIncome> incomes = budgetTableIncomeRepository.findByUserIdAndDateBetween(user_id, startDate, endDate);
            List<PwBudgetTableExpense> expenses = budgetTableExpenseRepository.findByUserIdAndDateBetween(user_id, startDate, endDate);
            Map<Date, Map<String, Object>> budgets = new HashMap<>();
            System.out.println(startDate);
            System.out.println(endDate);

            for (PwBudgetTableIncome income : incomes) {
                Date date = income.getDate();
                if (!budgets.containsKey(date)) {
                    budgets.put(date, new HashMap<>());
                    budgets.get(date).put("user_id", user_id);
                    budgets.get(date).put("income", new ArrayList<>());
                    budgets.get(date).put("expense", new ArrayList<>());
                }
                ((List)budgets.get(date).get("income")).add(income.toMap());
            }
        
            for (PwBudgetTableExpense expense : expenses) {
                Date date = expense.getDate();
                if (!budgets.containsKey(date)) {
                    budgets.put(date, new HashMap<>());
                    budgets.get(date).put("user_id", user_id);
                    budgets.get(date).put("income", new ArrayList<>());
                    budgets.get(date).put("expense", new ArrayList<>());
                }
                ((List)budgets.get(date).get("expense")).add(expense.toMap());
            }

            response.put("success", true);
            response.put("message", "Retrieved budgets in date range");
            response.put("budgets", budgets);

            return ResponseEntity.ok(response);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
