package com.planwise.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.math.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private PwCategoryRepository categoryRepository;

    @Autowired
    private PwUserRepository userRepository;

    @Autowired
    private PwBudgetTableExpenseRepository budgetTableExpenseRepository;

    @Autowired
    private PwExpenseRepository expenseRepository;

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getCategoriesByUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        Optional<PwUser> userOptional = userRepository.findById(user_id);
        if (!userOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    
        List<PwCategory> categories = categoryRepository.findByUserId(user_id);
        if (categories.isEmpty()) {
            response.put("success", false);
            response.put("message", "No categories found for the user");
            return ResponseEntity.status(404).body(response);
        }
    
        List<Map<String, Object>> categoryExpenses = new ArrayList<>();
        for (PwCategory category : categories) {
            Map<String, Object> categoryExpense = new HashMap<>();
            categoryExpense.put("id", category.getId());
            categoryExpense.put("category_name", category.getCategoryName());
    
            List<PwBudgetTableExpense> expenses = budgetTableExpenseRepository.findByCategory(category.getId());
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (PwBudgetTableExpense expense : expenses) {
                totalAmount = totalAmount.add(expense.getAmount());
            }
            BigDecimal averageMonthlyExpense = totalAmount.divide(new BigDecimal(12), 2, RoundingMode.HALF_UP);
            categoryExpense.put("average_monthly_expense", averageMonthlyExpense);
    
            categoryExpenses.add(categoryExpense);
        }
    
        response.put("success", true);
        response.put("message", "Categories retrieved successfully");
        response.put("categories", categoryExpenses);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> createCategory(@RequestBody CategoryRequest categoryRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        Optional<PwUser> userOptional = userRepository.findById(user_id);
        if (!userOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    
        PwUser user = userOptional.get();
        PwCategory category = new PwCategory();
        category.setCategoryName(categoryRequest.getCategoryName());
        category.setUser(user);
        categoryRepository.save(category);
    
        response.put("success", true);
        response.put("message", "Category created successfully");
        response.put("category", category);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{category_id}")
    public ResponseEntity<Map<String, Object>> getCategory(@PathVariable Long category_id, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        Optional<PwCategory> categoryOptional = categoryRepository.findByIdAndUserId(category_id, user_id);
        if (!categoryOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "Category not found or not owned by the user");
            return ResponseEntity.status(404).body(response);
        }
    
        PwCategory category = categoryOptional.get();
        response.put("success", true);
        response.put("message", "Category retrieved successfully");
        response.put("category", category);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{category_id}")
    public ResponseEntity<Map<String, Object>> updateCategory(@PathVariable Long category_id, @RequestBody CategoryRequest categoryRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        Optional<PwCategory> categoryOptional = categoryRepository.findByIdAndUserId(category_id, user_id);
        if (!categoryOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "Category not found or not owned by the user");
            return ResponseEntity.status(404).body(response);
        }
    
        PwCategory category = categoryOptional.get();
        category.setCategoryName(categoryRequest.getCategoryName());
        categoryRepository.save(category);
    
        response.put("success", true);
        response.put("message", "Category updated successfully");
        response.put("category", category);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{category_id}")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long category_id, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");
        Optional<PwCategory> categoryOptional = categoryRepository.findByIdAndUserId(category_id, user_id);
        if (!categoryOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "Category not found or not owned by the user");
            return ResponseEntity.status(404).body(response);
        }
    
        List<PwExpense> expenses = expenseRepository.findByCategoryId(Math.toIntExact(category_id));
        if(expenses != null){
            for (PwExpense expense : expenses) {
                expense.setCategory(null);
                expenseRepository.save(expense);
            }
        }
    
        categoryRepository.deleteById(category_id);
    
        response.put("success", true);
        response.put("message", "Category deleted successfully");
        return ResponseEntity.ok(response);
    }
    
}
