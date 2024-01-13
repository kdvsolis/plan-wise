package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PwBudgetTableIncomeRepository extends JpaRepository<PwBudgetTableIncome, Long> {
    void deleteByDateAfterAndIncomeIdAndUserId(Date date, Long incomeId, Integer userId);
}