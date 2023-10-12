from typing import Optional
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from util.token_parser import get_current_user

from services.income_service import IncomeService

router = APIRouter()
income_service = IncomeService()

class IncomeRequest(BaseModel):
    source: str
    amount: float
    start_date: str
    frequency: int

@router.post("/income")
def create_income(income_request: IncomeRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = income_service.create_income(current_user, income_request)
    if result.get("success"):
        return result
    else:
        return JSONResponse(status_code=400, content=result)


@router.get("/income")
def get_expense(current_user: int = Depends(get_current_user)):
    result = income_service.get_income_by_user(current_user)
    if result.get("message") == "Income retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.get("/income/{income_id}")
def get_expense(income_id: int, current_user: int = Depends(get_current_user)):
    result = income_service.get_income(current_user, income_id)
    if result.get("message") == "Income retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.put("/income/{income_id}")
def update_expense(income_id: int, income_request: IncomeRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = income_service.update_income(current_user, income_id, income_request)

    if result.get("message") == "Income updated successfully":
        return result
    else:
        if result.get("message") == "Income not found or not owned by the user":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)

@router.delete("/income/{income_id}")
def delete_expense(income_id: int, current_user: int = Depends(get_current_user)):
    result = income_service.delete_income(current_user, income_id)
    if result.get("message") == "Income deleted successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
