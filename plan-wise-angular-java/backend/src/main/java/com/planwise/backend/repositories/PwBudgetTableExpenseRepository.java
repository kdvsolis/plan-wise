package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PwBudgetTableExpenseRepository extends JpaRepository<PwBudgetTableExpense, Long> {
    List<PwBudgetTableExpense> findByCategory(Integer categoryId);
}
