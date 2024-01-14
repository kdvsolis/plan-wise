package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "pw_budget_table_expense")
public class PwBudgetTableExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;
    @Column(name = "expense_id", nullable = false)
    private Integer expenseId;
    @Column(nullable = false)
    private String expenses;
    private BigDecimal amount;
    @Column(name = "start_date", nullable = false)
    private Date startDate;
    private Integer frequency;
    private Long category;

    public PwBudgetTableExpense() {}

    public PwBudgetTableExpense(Integer id, Date date, PwUser user, Integer expenseId, String expenses, BigDecimal amount, Date startDate, Integer frequency, Long category) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.expenseId = expenseId;
        this.expenses = expenses;
        this.amount = amount;
        this.startDate = startDate;
        this.frequency = frequency;
        this.category = category;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
    public Integer getExpenseId() { return expenseId; }
    public void setExpenseId(Integer expenseId) { this.expenseId = expenseId; }
    public String getExpenses() { return expenses; }
    public void setExpenses(String expenses) { this.expenses = expenses; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public Long getCategory() { return category; }
    public void setCategory(Long category) { this.category = category; }
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("date", this.date);
        map.put("user", this.user != null ? this.user.toMap() : null);
        map.put("expense_id", this.expenseId);
        map.put("expenses", this.expenses);
        map.put("amount", this.amount);
        map.put("startDate", this.startDate);
        map.put("frequency", this.frequency);
        map.put("category", this.category);
        return map;
    }
}
