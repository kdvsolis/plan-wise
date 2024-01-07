package com.planwise.backend;

import com.planwise.backend.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PwUserRepository extends JpaRepository<PwUser, Integer> {
    Optional<PwUser> findByEmail(String email);
}
