package com.planwise.backend;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class BudgetRequest {
    private Date date;
    private List<Map<String, Object>> expense;
    private List<Map<String, Object>> income;

    // Getters and setters
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public List<Map<String, Object>> getExpense() { return expense; }
    public void setExpense(List<Map<String, Object>> expense) { this.expense = expense; }
    public List<Map<String, Object>> getIncome() { return income; }
    public void setIncome(List<Map<String, Object>> income) { this.income = income; }
}
