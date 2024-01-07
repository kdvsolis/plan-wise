package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_budget_table_income")
public class PwBudgetTableIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date date;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;
    private Integer income_id;
    @Column(nullable = false)
    private String source;
    private BigDecimal amount;
    private Date start_date;
    private Integer frequency;

    public PwBudgetTableIncome() {}

    public PwBudgetTableIncome(Integer id, Date date, PwUser user, Integer income_id, String source, BigDecimal amount, Date start_date, Integer frequency) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.income_id = income_id;
        this.source = source;
        this.amount = amount;
        this.start_date = start_date;
        this.frequency = frequency;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
    public Integer getIncome_id() { return income_id; }
    public void setIncome_id(Integer income_id) { this.income_id = income_id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStart_date() { return start_date; }
    public void setStart_date(Date start_date) { this.start_date = start_date; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
}