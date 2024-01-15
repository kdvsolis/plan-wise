package com.planwise.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimeZone;
import java.util.Calendar;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.math.*;
import java.text.SimpleDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/budget")
public class BudgetTableController {

    @Autowired
    private PwBudgetTableIncomeRepository budgetTableIncomeRepository;

    @Autowired
    private PwBudgetTableExpenseRepository budgetTableExpenseRepository;

    @Autowired
    private PwUserRepository userRepository;

    @Autowired
    private PwNotesRepository pwNotesRepository;

    @PutMapping("/update_budgets")
    public ResponseEntity<Map<String, Object>> updateBudgets(@RequestBody BudgetRequest budget, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer user_id = (Integer) request.getAttribute("user_id");

        try {
            // Update income
            for (Map<String, Object> income : budget.getIncome()) {
                Long id = Long.valueOf(income.get("id").toString());
                Optional<PwBudgetTableIncome> record = budgetTableIncomeRepository.findById(id);
                if (record.isPresent()) {
                    PwBudgetTableIncome updatedIncome = record.get();
                    updatedIncome.setAmount(new BigDecimal(income.get("amount").toString()));
                    updatedIncome.setDate(DateDataGenerator.parseDateString(income.get("date").toString()));
                    budgetTableIncomeRepository.save(updatedIncome);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid Request");
                    return ResponseEntity.status(400).body(response);
                }
            }

            // Update expenses
            for (Map<String, Object> expense : budget.getExpense()) {
                Long id = Long.valueOf(expense.get("id").toString());
                Optional<PwBudgetTableExpense> record = budgetTableExpenseRepository.findById(id);
                if (record.isPresent()) {
                    PwBudgetTableExpense updatedExpense = record.get();
                    updatedExpense.setAmount(new BigDecimal(expense.get("amount").toString()));
                    updatedExpense.setDate(DateDataGenerator.parseDateString(expense.get("date").toString()));
                    budgetTableExpenseRepository.save(updatedExpense);
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid Request");
                    return ResponseEntity.status(400).body(response);
                }
            }

            response.put("success", true);
            response.put("message", "Budgets updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


    @GetMapping("/get_budgets_in_date_range")
    public ResponseEntity<Map<String, Object>> getBudgetsInDateRange(@RequestParam(required = false) String start_date_str, HttpServletRequest request) {
        try {
            Map<String, Object> response = new HashMap<>();
            Integer user_id = (Integer) request.getAttribute("user_id");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            TimeZone tz = TimeZone.getTimeZone("UTC");
            sdf.setTimeZone(tz);
            sdf.setLenient(false);
            Date startDate;
            System.out.println(user_id);
            Date earliestIncomeDate = budgetTableIncomeRepository.findEarliestDateByUserId(user_id);
            Date earliestExpenseDate = budgetTableExpenseRepository.findEarliestDateByUserId(user_id);
            Date earliestDate = earliestIncomeDate.before(earliestExpenseDate) ? earliestIncomeDate : earliestExpenseDate;
            if (start_date_str == null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(earliestDate);
                cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
                startDate = cal.getTime();
            } else {
                startDate = sdf.parse(start_date_str);
            }
            Calendar cal = Calendar.getInstance();
            cal.setTime(startDate);
            cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
            Date endDate = cal.getTime();
            List<PwBudgetTableIncome> incomes = budgetTableIncomeRepository.findByUserIdAndDateBetween(user_id, startDate, endDate);
            List<PwBudgetTableExpense> expenses = budgetTableExpenseRepository.findByUserIdAndDateBetween(user_id, startDate, endDate);
            Map<Date, Map<String, Object>> budgets = new TreeMap<>();
            for (PwBudgetTableIncome income : incomes) {
                Date date = income.getDate();
                if (!budgets.containsKey(date)) {
                    budgets.put(date, new HashMap<>());
                    budgets.get(date).put("user_id", user_id);
                    budgets.get(date).put("income", new ArrayList<>());
                    budgets.get(date).put("expense", new ArrayList<>());
                }
                ((List)budgets.get(date).get("income")).add(income.toMap());
            }
            for (PwBudgetTableExpense expense : expenses) {
                Date date = expense.getDate();
                if (!budgets.containsKey(date)) {
                    budgets.put(date, new HashMap<>());
                    budgets.get(date).put("user_id", user_id);
                    budgets.get(date).put("income", new ArrayList<>());
                    budgets.get(date).put("expense", new ArrayList<>());
                }
                ((List)budgets.get(date).get("expense")).add(expense.toMap());
            }
            response.put("success", true);
            response.put("message", "Retrieved budgets in date range");
            response.put("budgets", budgets);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, Object>> createNote(@RequestBody NoteRequest noteRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
    
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
    
        PwNotes note = new PwNotes();
        note.setUser(user);
        note.setDate(noteRequest.getDate());
        note.setNotes(noteRequest.getNotes());
    
        pwNotesRepository.save(note);
    
        response.put("success", true);
        response.put("message", "Note created successfully");
        response.put("note", note);
        return ResponseEntity.ok(response);
    }
    

    @GetMapping("/notes")
    public ResponseEntity<Map<String, Object>> getNotesByDate(@RequestParam String date, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
    
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
    
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateObj;
        try {
            dateObj = sdf.parse(date);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid date format");
            return ResponseEntity.ok(response);
        }
    
        List<PwNotes> notes = pwNotesRepository.findByUserIdAndDate(userId, dateObj);
        if (notes.isEmpty()) {
            response.put("success", false);
            response.put("message", "Notes not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
    
        List<Map<String, Object>> notesList = notes.stream().map(PwNotes::toMap).collect(Collectors.toList());
    
        response.put("success", true);
        response.put("message", "Notes retrieved successfully");
        response.put("notes", notesList);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/notes/{noteId}")
    public ResponseEntity<Map<String, Object>> updateNote(@PathVariable Integer noteId, @RequestBody NoteRequest noteRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");
    
        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }
    
        PwNotes note = pwNotesRepository.findByIdAndUserId(noteId, userId);
        if (note == null) {
            response.put("success", false);
            response.put("message", "Note not found or not owned by the user");
            return ResponseEntity.ok(response);
        }
    
        note.setNotes(noteRequest.getNotes());
        pwNotesRepository.save(note);
    
        response.put("success", true);
        response.put("message", "Note updated successfully");
        response.put("note", note);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/notes/{noteId}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Integer noteId, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");

        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }

        PwNotes note = pwNotesRepository.findByIdAndUserId(noteId, userId);
        if (note == null) {
            response.put("success", false);
            response.put("message", "Note not found or not owned by the user");
            return ResponseEntity.ok(response);
        }

        pwNotesRepository.delete(note);

        response.put("success", true);
        response.put("message", "Note deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/notes")
    public ResponseEntity<Map<String, Object>> updateNotesByDate(@RequestParam String date, @RequestBody NoteRequest noteRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = (Integer) request.getAttribute("user_id");

        PwUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.ok(response);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dateObj;
        try {
            dateObj = sdf.parse(date);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Invalid date format");
            return ResponseEntity.ok(response);
        }

        List<PwNotes> notes = pwNotesRepository.findByUserIdAndDate(userId, dateObj);
        if (notes.isEmpty()) {
            response.put("success", false);
            response.put("message", "Notes not found or not owned by the user");
            return ResponseEntity.ok(response);
        }

        for (PwNotes note : notes) {
            note.setNotes(noteRequest.getNotes());
        }
        pwNotesRepository.saveAll(notes);

        response.put("success", true);
        response.put("message", "Notes updated successfully");
        response.put("notes", notes);
        return ResponseEntity.ok(response);
    }


}
