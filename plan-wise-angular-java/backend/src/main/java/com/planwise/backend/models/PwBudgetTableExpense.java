package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_budget_table_expense")
public class PwBudgetTableExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date date;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;
    private Integer expense_id;
    @Column(nullable = false)
    private String expenses;
    private BigDecimal amount;
    private Date start_date;
    private Integer frequency;
    private Integer category;

    public PwBudgetTableExpense() {}

    public PwBudgetTableExpense(Integer id, Date date, PwUser user, Integer expense_id, String expenses, BigDecimal amount, Date start_date, Integer frequency, Integer category) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.expense_id = expense_id;
        this.expenses = expenses;
        this.amount = amount;
        this.start_date = start_date;
        this.frequency = frequency;
        this.category = category;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
    public Integer getExpense_id() { return expense_id; }
    public void setExpense_id(Integer expense_id) { this.expense_id = expense_id; }
    public String getExpenses() { return expenses; }
    public void setExpenses(String expenses) { this.expenses = expenses; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStart_date() { return start_date; }
    public void setStart_date(Date start_date) { this.start_date = start_date; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public Integer getCategory() { return category; }
    public void setCategory(Integer category) { this.category = category; }
}
