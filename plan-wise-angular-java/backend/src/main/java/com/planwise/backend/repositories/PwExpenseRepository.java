package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.List;

@Repository
public interface PwExpenseRepository extends JpaRepository<PwExpense, Long> {
    List<PwExpense> findByCategoryId(Integer category_id);
    Optional<PwExpense> findByIdAndUserId(Long id, Integer userId);
    List<PwExpense> findByUserIdOrderByStartDate(Integer userId);
    List<PwExpense> findByUserId(Integer userId);
}