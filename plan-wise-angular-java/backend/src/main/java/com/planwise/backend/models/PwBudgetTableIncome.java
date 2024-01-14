package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "pw_budget_table_income")
public class PwBudgetTableIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;
    @Column(name = "income_id", nullable = false)
    private Long incomeId;
    @Column(nullable = false)
    private String source;
    private BigDecimal amount;
    @Column(name = "start_date", nullable = false)
    private Date startDate;
    private Integer frequency;

    public PwBudgetTableIncome() {}

    public PwBudgetTableIncome(Integer id, Date date, PwUser user, Long incomeId, String source, BigDecimal amount, Date startDate, Integer frequency) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.incomeId = incomeId;
        this.source = source;
        this.amount = amount;
        this.startDate = startDate;
        this.frequency = frequency;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
    public Long getIncomeId() { return incomeId; }
    public void setIncomeId(Long incomeId) { this.incomeId = incomeId; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("date", this.date);
        map.put("user", this.user != null ? this.user.toMap() : null);
        map.put("income_id", this.incomeId);
        map.put("source", this.source);
        map.put("amount", this.amount);
        map.put("start_date", this.startDate);
        map.put("frequency", this.frequency);
        return map;
    }
}