package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_notes")
public class PwNotes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private Date date;
    private String notes;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwNotes() {}

    public PwNotes(Integer id, Date date, String notes, PwUser user) {
        this.id = id;
        this.date = date;
        this.notes = notes;
        this.user = user;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
}
