package com.planwise.backend;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pw_categories")
public class PwCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "category_name", nullable = false)
    private String categoryName;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private PwUser user;

    public PwCategory() {}

    public PwCategory(Integer id, String categoryName, PwUser user) {
        this.id = id;
        this.categoryName = categoryName;
        this.user = user;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public PwUser getUser() { return user; }
    public void setUser(PwUser user) { this.user = user; }
}
