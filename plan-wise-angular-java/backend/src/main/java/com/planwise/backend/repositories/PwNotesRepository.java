package com.planwise.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.persistence.*;
import java.util.*;

@Repository
public interface PwNotesRepository extends JpaRepository<PwNotes, Integer> {
    PwNotes findByIdAndUserId(Integer noteId, Integer userId);
    List<PwNotes> findByUserIdAndDate(Integer userId, Date date);
    // @Query(value = "SELECT * FROM pw_notes n WHERE n.user_id = :userId AND n.date = :date", nativeQuery = true)
    // List<PwNotes> findByUserIdAndDate(@Param("userId") Integer userId, @Param("date") Date date);
}
