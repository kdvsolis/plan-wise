from typing import Optional
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from util.token_parser import get_current_user

from services.expense_service import ExpenseService

router = APIRouter()
expense_service = ExpenseService()

class ExpenseRequest(BaseModel):
    expenses: str
    amount: float
    start_date: str
    frequency: float
    category: int = None

@router.post("/expense")
def create_expense(expense_request: ExpenseRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = expense_service.create_expense(current_user, expense_request)
    if result.get("success"):
        return result
    else:
        return JSONResponse(status_code=400, content=result)

@router.get("/expenses")
def get_expense(current_user: int = Depends(get_current_user)):
    result = expense_service.get_expenses_by_user(current_user)
    if result.get("message") == "Expense retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.get("/expenses/{expense_id}")
def get_expense(expense_id: int, current_user: int = Depends(get_current_user)):
    result = expense_service.get_expense(current_user, expense_id)
    if result.get("message") == "Expense retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.put("/expenses/{expense_id}")
def update_expense(expense_id: int, expense_request: ExpenseRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = expense_service.update_expense(current_user, expense_id, expense_request)

    if result.get("message") == "Expense updated successfully":
        return result
    else:
        if result.get("message") == "Expense not found or not owned by the user":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, current_user: int = Depends(get_current_user)):
    result = expense_service.delete_expense(current_user, expense_id)
    if result.get("message") == "Expense deleted successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
