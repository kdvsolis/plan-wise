from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from util.token_parser import get_current_user

from services.category_service import CategoryService
from services.auth_service import SECRET_KEY

router = APIRouter()
category_service = CategoryService()

class CategoryRequest(BaseModel):
    category_name: str

@router.post("/categories")
def create_category(category_request: CategoryRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = category_service.create_category(current_user, category_request.category_name)
    if result.get("message") == "Category created successfully":
        return result
    else:
        return JSONResponse(status_code=400, content=result)

@router.get("/categories")
def get_category(current_user: int = Depends(get_current_user)):
    result = category_service.get_categories_by_user(current_user)
    if result.get("message") == "Category retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.get("/categories/{category_id}")
def get_category(category_id: int, current_user: int = Depends(get_current_user)):
    result = category_service.get_category(current_user, category_id)
    if result.get("message") == "Category retrieved successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
    
@router.put("/categories/{category_id}")
def update_category(category_id: int, category_request: CategoryRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = category_service.update_category(current_user, category_id, category_request.category_name)

    if result.get("message") == "Category updated successfully":
        return result
    else:
        if result.get("message") == "Category not found or not owned by the user":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, current_user: int = Depends(get_current_user)):
    result = category_service.delete_category(current_user, category_id)
    if result.get("message") == "Category deleted successfully":
        return result
    else:
        return JSONResponse(status_code=404, content=result)
