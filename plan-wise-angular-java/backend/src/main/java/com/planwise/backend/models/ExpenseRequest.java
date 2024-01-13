package com.planwise.backend;

import java.math.BigDecimal;
import java.util.Date;

public class ExpenseRequest {
    private String expenses;
    private BigDecimal amount;
    private Date startDate; // Changed from String to Date
    private BigDecimal frequency;
    private Long category;

    public String getExpenses() {
        return expenses;
    }

    public void setExpenses(String expenses) {
        this.expenses = expenses;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Date getStartDate() { // Changed return type from String to Date
        return startDate;
    }

    public void setStartDate(Date startDate) { // Changed parameter type from String to Date
        this.startDate = startDate;
    }

    public BigDecimal getFrequency() {
        return frequency;
    }

    public void setFrequency(BigDecimal frequency) {
        this.frequency = frequency;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }
}
