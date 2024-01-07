package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_expenses")
public class PwExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String expenses;
    private BigDecimal amount;
    private Date start_date;
    private Integer frequency;
    @ManyToOne
    @JoinColumn(name="category", nullable=true)
    private PwCategory category;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwExpense() {}

    public PwExpense(Integer id, String expenses, BigDecimal amount, Date start_date, Integer frequency, PwCategory category, PwUser user) {
        this.id = id;
        this.expenses = expenses;
        this.amount = amount;
        this.start_date = start_date;
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
    public Date getStart_date() { return start_date; }
    public void setStart_date(Date start_date) { this.start_date = start_date; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public PwCategory getCategory() { return category; }
    public void setCategory(PwCategory category) { this.category = category; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
}