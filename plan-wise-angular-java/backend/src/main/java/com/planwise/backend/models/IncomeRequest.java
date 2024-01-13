package com.planwise.backend;

import java.math.BigDecimal;
import java.util.Date;

public class IncomeRequest {
    private String source;
    private BigDecimal amount;
    private Date startDate;
    private Integer frequency;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
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

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }
}
