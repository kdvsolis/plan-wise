package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "pw_expenses")
public class PwExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String expenses;
    private BigDecimal amount;
    @Column(name = "start_date", nullable = false)
    private Date startDate;
    private Integer frequency;
    @ManyToOne
    @JoinColumn(name="category", nullable=true)
    private PwCategory category;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwExpense() {}

    public PwExpense(Integer id, String expenses, BigDecimal amount, Date startDate, Integer frequency, PwCategory category, PwUser user) {
        this.id = id;
        this.expenses = expenses;
        this.amount = amount;
        this.startDate = startDate;
        this.frequency = frequency;
        this.category = category;
        this.user = user;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getExpenses() { return expenses; }
    public void setExpenses(String expenses) { this.expenses = expenses; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public PwCategory getCategory() { return category; }
    public void setCategory(PwCategory category) { this.category = category; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("expenses", this.expenses);
        map.put("amount", this.amount);
        map.put("start_date", this.startDate);
        map.put("frequency", this.frequency);
        map.put("category", this.category);
        map.put("user", this.user);
        return map;
    }
}

