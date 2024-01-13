package com.planwise.backend;

import com.planwise.backend.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PwIncomeRepository extends JpaRepository<PwIncome, Long> {
    Optional<PwIncome> findByIdAndUserId(Long id, Integer userId);
    List<PwIncome> findByUserIdOrderByStartDate(Integer userId);
    List<PwIncome> findByUserId(Integer userId);
}