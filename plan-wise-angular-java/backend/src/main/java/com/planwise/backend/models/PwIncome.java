package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_income")
public class PwIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String source;
    private BigDecimal amount;
    private Date start_date;
    private Integer frequency;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwIncome() {}

    public PwIncome(Integer id, String source, BigDecimal amount, Date start_date, Integer frequency, PwUser user) {
        this.id = id;
        this.source = source;
        this.amount = amount;
        this.start_date = start_date;
        this.frequency = frequency;
        this.user = user;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Date getStart_date() { return start_date; }
    public void setStart_date(Date start_date) { this.start_date = start_date; }
    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
}