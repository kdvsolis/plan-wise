package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.*;

@Repository
public interface PwCategoryRepository extends JpaRepository<PwCategory, Long> {
    Optional<PwCategory> findByCategoryName(String categoryName);
    Optional<PwCategory> findByIdAndUserId(Long id, Integer userId);
    List<PwCategory> findByUserId(Integer userId);
}
