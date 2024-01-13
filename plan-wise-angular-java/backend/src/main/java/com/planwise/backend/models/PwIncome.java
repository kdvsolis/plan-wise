package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_income")
public class PwIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String source;
    private BigDecimal amount;
    @Column(name = "start_date", nullable = false)
    private Date startDate;
    private Integer frequency;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwIncome() {}

    public PwIncome(Long id, String source, BigDecimal amount, Date startDate, Integer frequency, PwUser user) {
        this.id = id;
        this.source = source;
        this.amount = amount;
        this.startDate = startDate;
        this.frequency = frequency;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
}