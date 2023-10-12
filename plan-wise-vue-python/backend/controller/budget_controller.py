from typing import List, Optional
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from datetime import date

from util.token_parser import get_current_user

from services.budget_table_service import BudgetService
from services.auth_service import SECRET_KEY

router = APIRouter()
budget_service = BudgetService()

class NoteRequest(BaseModel):
    date: str
    notes: str

class BudgetRequest(BaseModel):
    date: date
    expense: List[dict]
    income: List[dict]

@router.post("/notes")
def create_note(note_request: NoteRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = budget_service.create_note(current_user, note_request.date, note_request.notes)
    if result.get("message") == "Note created successfully":
        return result
    else:
        return JSONResponse(status_code=400, content=result)

@router.get("/notes")
def get_notes_by_date(date: str, current_user: int = Depends(get_current_user)):
    result = budget_service.get_notes_by_date(current_user, date)
    if result.get("success"):
        return result
    else:
        return JSONResponse(status_code=404, content=result)

@router.put("/notes/{note_id}")
def update_note(note_id: int, note_request: NoteRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = budget_service.update_note(current_user, note_id, note_request.date, note_request.notes)

    if result.get("message") == "Note updated successfully":
        return result
    else:
        if result.get("message") == "Note not found or not owned by the user":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)

@router.delete("/notes/{note_id}")
def delete_note(note_id: int, current_user: int = Depends(get_current_user)):
    result = budget_service.delete_note(current_user, note_id)
    if result.get("message") == "Note deleted successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)

@router.put("/notes")
def update_notes_by_date(date: str, note_request: NoteRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = budget_service.update_notes_by_date(current_user, date, note_request.notes)

    if result.get("message") == "Notes updated successfully":
        return result
    else:
        if result.get("message") == "Notes not found or not owned by the user":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)

@router.get("/budgets_start_dates")
def get_budget(current_user: int = Depends(get_current_user)):
    result = budget_service.get_initial_start_dates(current_user)
    if result.get("message") == "Start dates retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)

@router.put("/update_budgets")
def update_budgets(budget: BudgetRequest, current_user: int = Depends(get_current_user)):
    try:
        # Update income
        for income in budget.income:
            result = budget_service.update_income(income)
            if result is None:
                return JSONResponse(status_code=400, content={"success": False, "message": "Invalid Request"})

        # Update expenses
        for expense in budget.expense:
            result = budget_service.update_expense(expense)
            if result is None:
                return JSONResponse(status_code=400, content={"success": False, "message": "Invalid Request"})

        return {"success": True, "message": "Budgets updated successfully"}

    except Exception as e:
        return {"success": False, "message": str(e)}

@router.get("/get_budgets_in_date_range")
def get_budgets_in_date_range(start_date_str: Optional[str] = None, current_user: int = Depends(get_current_user)):
    result = budget_service.get_budgets_in_date_range(current_user, start_date_str)
    
    if result.get("message") == "Retrieved budgets in date range":
        return result
    else:
        return JSONResponse(status_code=400, content=result)
