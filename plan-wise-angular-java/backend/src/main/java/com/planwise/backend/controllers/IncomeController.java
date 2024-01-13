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
@RequestMapping("/api/income")
public class IncomeController {
    @Autowired
    private PwUserRepository userRepository;
    @Autowired
    private PwIncomeRepository incomeRepository;
    @Autowired
    private PwBudgetTableIncomeRepository budgetIncomeRepository;

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> createIncome(@RequestBody IncomeRequest incomeRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        PwIncome income = new PwIncome();
        income.setSource(incomeRequest.getSource());
        income.setAmount(incomeRequest.getAmount());
        income.setStartDate(incomeRequest.getStartDate());
        income.setFrequency(incomeRequest.getFrequency());
        income.setUser(user);
        incomeRepository.save(income);
        
        // Delete the future budget incomes
        budgetIncomeRepository.deleteByDateAfterAndIncomeIdAndUserId(new Date(), income.getId(), userId);
        
        // Generate new budget incomes and save them
        List<Map<String, Object>> incomes = new ArrayList<>();
        Map<String, Object> incomeData = new HashMap<>();
        incomeData.put("source", incomeRequest.getSource());
        incomeData.put("income_id", income.getId());
        incomeData.put("amount", incomeRequest.getAmount());
        incomeData.put("start_date", incomeRequest.getStartDate());
        incomeData.put("frequency", incomeRequest.getFrequency());
        incomes.add(incomeData);
        
        Map<String, List<Map<String, Object>>> budgetData = DateDataGenerator.groupByDate(incomes);
        List<PwBudgetTableIncome> budgetIncomes = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : budgetData.entrySet()) {
            for (Map<String, Object> item : entry.getValue()) {
                PwBudgetTableIncome budgetIncome = new PwBudgetTableIncome();
                try {
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    budgetIncome.setDate(formatter.parse(entry.getKey()));
                    budgetIncome.setUser(user);
                    budgetIncome.setIncomeId(income.getId());
                    budgetIncome.setSource((String) item.get("source"));
                    budgetIncome.setAmount((BigDecimal) item.get("amount"));
                    budgetIncome.setStartDate((Date) item.get("start_date"));
                    budgetIncome.setFrequency((Integer) item.get("frequency"));
                    budgetIncomes.add(budgetIncome);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        budgetIncomeRepository.saveAll(budgetIncomes);
        
        response.put("success", true);
        response.put("message", "Income updated successfully");
        response.put("income", income);
        return ResponseEntity.ok(response);
    }    

    @GetMapping("/{incomeId}")
    public ResponseEntity<Map<String, Object>> getIncome(HttpServletRequest request, @PathVariable Long incomeId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        PwIncome income = incomeRepository.findByIdAndUserId(incomeId, userId).orElse(null);
        if (income == null) {
            response.put("success", false);
            response.put("message", "Income not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "Income retrieved successfully");
        response.put("income", income);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getIncomeByUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        List<PwIncome> income = incomeRepository.findByUserIdOrderByStartDate(userId);
        if (income.isEmpty()) {
            response.put("success", false);
            response.put("message", "Income not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "Income retrieved successfully");
        response.put("income", income);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{incomeId}")
    public ResponseEntity<Map<String, Object>> updateIncome(@RequestBody IncomeRequest incomeRequest, HttpServletRequest request, @PathVariable Long incomeId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        PwIncome income = incomeRepository.findByIdAndUserId(incomeId, userId).orElse(null);
        if (income == null) {
            response.put("success", false);
            response.put("message", "Income not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
        
        // Update the properties of the income object using the incomeRequest
        income.setSource(incomeRequest.getSource());
        income.setAmount(incomeRequest.getAmount());
        income.setStartDate(incomeRequest.getStartDate());
        income.setFrequency(incomeRequest.getFrequency());
        incomeRepository.save(income);
        
        // Delete the future budget incomes
        budgetIncomeRepository.deleteByDateAfterAndIncomeIdAndUserId(new Date(), incomeId, userId);
        
        // Generate new budget incomes and save them
        List<Map<String, Object>> expenses = new ArrayList<>();
        Map<String, Object> expenseData = new HashMap<>();
        expenseData.put("source", incomeRequest.getSource());
        expenseData.put("income_id", income.getId());
        expenseData.put("amount", incomeRequest.getAmount());
        expenseData.put("start_date", incomeRequest.getStartDate());
        expenseData.put("frequency", incomeRequest.getFrequency());
        expenses.add(expenseData);
        
        Map<String, List<Map<String, Object>>> budgetData = DateDataGenerator.groupByDate(expenses);
        List<PwBudgetTableIncome> budgetIncomes = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : budgetData.entrySet()) {
            for (Map<String, Object> item : entry.getValue()) {
                PwBudgetTableIncome budgetIncome = new PwBudgetTableIncome();
                try {
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    budgetIncome.setDate(formatter.parse(entry.getKey()));
                    budgetIncome.setUser(user);
                    budgetIncome.setIncomeId(income.getId());
                    budgetIncome.setSource((String) item.get("source"));
                    budgetIncome.setAmount(BigDecimal.valueOf((Double) item.get("amount")));
                    budgetIncome.setStartDate((Date) item.get("start_date"));
                    budgetIncome.setFrequency((Integer) item.get("frequency"));
                    budgetIncomes.add(budgetIncome);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        budgetIncomeRepository.saveAll(budgetIncomes);
        
        response.put("success", true);
        response.put("message", "Income updated successfully");
        response.put("income", income);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{incomeId}")
    public ResponseEntity<Map<String, Object>> deleteIncome(HttpServletRequest request, @PathVariable Long incomeId) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
        PwIncome income = incomeRepository.findByIdAndUserId(incomeId, userId).orElse(null);
        if (income == null) {
            response.put("success", false);
            response.put("message", "Income not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
        incomeRepository.delete(income);
        
        // Delete the future budget incomes
        budgetIncomeRepository.deleteByDateAfterAndIncomeIdAndUserId(new Date(), incomeId, userId);
        
        response.put("success", true);
        response.put("message", "Income deleted successfully");
        return ResponseEntity.ok(response);
    }
}
