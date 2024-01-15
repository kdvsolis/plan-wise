package com.planwise.backend;

import java.util.Date;

public class NoteRequest {
    private Date date;
    private String notes;

    public NoteRequest() {}

    public NoteRequest(Date date, String notes) {
        this.date = date;
        this.notes = notes;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
