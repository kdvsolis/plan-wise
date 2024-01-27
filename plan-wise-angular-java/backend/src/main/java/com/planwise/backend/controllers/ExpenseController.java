package com.planwise.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.*;
import java.text.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.math.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private PwExpenseRepository expenseRepository;

    @Autowired
    private PwCategoryRepository categoryRepository;

    @Autowired
    private PwUserRepository userRepository;

    @Autowired
    private PwBudgetTableExpenseRepository budgetTableExpenseRepository;

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> createExpense(@RequestBody ExpenseRequest expenseRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(user_id).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(400).body(response);
        }
        PwExpense expense = new PwExpense();
        expense.setUser(user);
        expense.setExpenses(expenseRequest.getExpenses());
        expense.setAmount(expenseRequest.getAmount());
        expense.setStartDate(expenseRequest.getStartDate());
        expense.setFrequency(expenseRequest.getFrequency().intValue());
        expense.setCategory(categoryRepository.findById(expenseRequest.getCategory()).orElse(null));
        expenseRepository.save(expense);
        List<Map<String, Object>> expenses = new ArrayList<>();
        expenses.add(expense.toMap());
        Map<String, List<Map<String, Object>>> budgetData = DateDataGenerator.groupByDate(expenses);
        List<PwBudgetTableExpense> budgetExpenses = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : budgetData.entrySet()) {
            for (Map<String, Object> item : entry.getValue()) {
                try {
                    PwBudgetTableExpense budgetExpense = new PwBudgetTableExpense();
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    budgetExpense.setDate(formatter.parse(entry.getKey()));
                    budgetExpense.setStartDate(formatter.parse(formatter.format((Date) item.get("start_date"))));
                    budgetExpense.setExpenseId(expense.getId());
                    budgetExpense.setExpenses((String) item.get("expenses"));
                    budgetExpense.setAmount((BigDecimal) item.get("amount"));
                    budgetExpense.setCategory(expenseRequest.getCategory());
                    budgetExpense.setFrequency((Integer) item.get("frequency"));
                    budgetExpense.setUser(user);
                    budgetExpenses.add(budgetExpense);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        budgetTableExpenseRepository.saveAll(budgetExpenses);
        response.put("success", true);
        response.put("message", "Expense created successfully");
        response.put("expense", expense);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getExpenses(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(user_id).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(400).body(response);
        }
        List<PwExpense> expenses = expenseRepository.findByUserIdOrderByStartDate(user_id);
        response.put("success", true);
        response.put("message", "Expenses retrieved successfully");
        response.put("expenses", expenses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<Map<String, Object>> getExpense(HttpServletRequest request, @PathVariable Long expenseId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(400).body(response);
        }
        PwExpense expense = expenseRepository.findByIdAndUserId(expenseId, userId).orElse(null);
        if (expense == null) {
            response.put("success", false);
            response.put("message", "Expense not found or not owned by the user");
            return ResponseEntity.status(400).body(response);
        }
        response.put("success", true);
        response.put("message", "Expense retrieved successfully");
        response.put("expense", expense);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Map<String, Object>> updateExpense(@RequestBody ExpenseRequest expenseRequest, HttpServletRequest request, @PathVariable Long expenseId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(400).body(response);
        }
        PwExpense expense = expenseRepository.findByIdAndUserId(expenseId, userId).orElse(null);
        if (expense == null) {
            response.put("success", false);
            response.put("message", "Expense not found or not owned by the user");
            return ResponseEntity.status(400).body(response);
        }
        expense.setExpenses(expenseRequest.getExpenses() != null ? expenseRequest.getExpenses() : expense.getExpenses());
        expense.setAmount(expenseRequest.getAmount() != null ? expenseRequest.getAmount() : expense.getAmount());
        expense.setStartDate(expenseRequest.getStartDate() != null ? expenseRequest.getStartDate() : expense.getStartDate());
        expense.setFrequency(expenseRequest.getFrequency() != null ? expenseRequest.getFrequency().intValue() : expense.getFrequency());
        expense.setCategory(expenseRequest.getCategory() != null ? categoryRepository.findById(expenseRequest.getCategory()).orElse(null) : expense.getCategory());
        expenseRepository.save(expense);
        budgetTableExpenseRepository.deleteByDateAfterAndExpenseIdAndUserId(new Date(), expenseId, userId);
        List<Map<String, Object>> expenses = new ArrayList<>();
        expenses.add(expense.toMap());
        Map<String, List<Map<String, Object>>> budgetData = DateDataGenerator.groupByDate(expenses);
        List<PwBudgetTableExpense> budgetExpenses = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : budgetData.entrySet()) {
            for (Map<String, Object> item : entry.getValue()) {
                PwBudgetTableExpense budgetExpense = new PwBudgetTableExpense();
                budgetExpense.setDate(new Date(entry.getKey()));
                budgetExpense.setUser(user);
                budgetExpense.setExpenseId(expense.getId());
                budgetExpense.setExpenses((String) item.get("expenses"));
                budgetExpense.setAmount(BigDecimal.valueOf((Double) item.get("amount")));
                budgetExpense.setStartDate(new Date((String) item.get("start_date")));
                budgetExpense.setCategory(expenseRequest.getCategory());
                budgetExpense.setFrequency((Integer) item.get("frequency"));
                budgetExpenses.add(budgetExpense);
            }
        }
        budgetTableExpenseRepository.saveAll(budgetExpenses);
        response.put("success", true);
        response.put("message", "Expense updated successfully");
        response.put("expense", expense);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Map<String, Object>> deleteExpense(HttpServletRequest request, @PathVariable Long expenseId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        PwExpense expense = expenseRepository.findByIdAndUserId(expenseId, userId).orElse(null);
        if (expense == null) {
            response.put("success", false);
            response.put("message", "Expense not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
        expenseRepository.delete(expense);
    
        budgetTableExpenseRepository.deleteByDateAfterAndExpenseIdAndUserId(new Date(), expenseId, userId);
        
        response.put("success", true);
        response.put("message", "Expense deleted successfully");
        return ResponseEntity.ok(response);
    }
}
