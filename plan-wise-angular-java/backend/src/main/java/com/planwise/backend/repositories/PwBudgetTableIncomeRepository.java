package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.persistence.*;
import java.util.*;

@Repository
public interface PwBudgetTableIncomeRepository extends JpaRepository<PwBudgetTableIncome, Long> {
    void deleteByDateAfterAndIncomeIdAndUserId(Date date, Long incomeId, Integer userId);
    @Query(value = "SELECT * FROM pw_budget_table_income i WHERE i.user_id = ?1 AND i.date BETWEEN ?2 AND ?3", nativeQuery = true)
    List<PwBudgetTableIncome> findByUserIdAndDateBetween(Integer userId, Date start, Date end); 
    @Query(value = "SELECT MIN(i.date) FROM pw_budget_table_income i WHERE i.user_id = ?1", nativeQuery = true)   
    Date findEarliestDateByUserId(Integer userId);
}