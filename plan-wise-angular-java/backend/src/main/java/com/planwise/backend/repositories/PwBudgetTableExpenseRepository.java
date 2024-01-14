package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.persistence.*;
import java.util.*;

@Repository
public interface PwBudgetTableExpenseRepository extends JpaRepository<PwBudgetTableExpense, Long> {
    List<PwBudgetTableExpense> findByCategory(Integer categoryId);
    void deleteByDateAfterAndExpenseIdAndUserId(Date date, Long expenseId, Integer userId);
    @Query(value = "SELECT * FROM pw_budget_table_expense i WHERE i.user_id = :userId AND i.date BETWEEN :start AND :end", nativeQuery = true)
    List<PwBudgetTableExpense> findByUserIdAndDateBetween(@Param("userId") Integer userId, @Param("start") Date start, @Param("end") Date end); 
    Date findEarliestDateByUserId(Integer userId);
}