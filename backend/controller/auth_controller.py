from fastapi import APIRouter, Body, Depends
from fastapi.responses import JSONResponse
from typing import Optional
from services.auth_service import register, login, update_user, get_user
from util.token_parser import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Create a model class for the register request
class RegisterRequest(BaseModel):
    name: str
    username: str
    password: str

@router.post("/register")
def register_controller(register_request: RegisterRequest = Body(...)):
    result = register(register_request.name, register_request.username, register_request.password)
    if result.get("message") == "Registration successful":
        return {
            "success": True,
            "message": result.get("message") 
        }
    else:
        raise JSONResponse(content=result, status_code=400)

class LoginRequest(BaseModel):
    username: str
    password: str

# Create a route for logging in a user
@router.post("/login")
def login_controller(login_request: LoginRequest = Body(...)):
    result = login(login_request.username, login_request.password)
    if result.get("success"):
        return result

    else:
        return JSONResponse(content=result, status_code=401)

class UserRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None
    balance: Optional[float] = None

@router.get("/user")
def get_user_api(current_user: int = Depends(get_current_user)):
    result = get_user(user_id=current_user)

    if result.get("message") == "User updated successfully":
        return result
    else:
        if result.get("message") == "User not found or not registered":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)   

@router.put("/user")
def update_user_api(user_request: UserRequest = Body(...), current_user: int = Depends(get_current_user)):
    result = update_user(current_user, user_request)

    if result.get("message") == "User updated successfully":
        return result
    else:
        if result.get("message") == "User not found or not registered":
            return JSONResponse(status_code=404, content=result)
        else:
            return JSONResponse(status_code=400, content=result)   
