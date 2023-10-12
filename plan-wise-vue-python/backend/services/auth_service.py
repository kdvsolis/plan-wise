import bcrypt
import jwt
import datetime

from app.database import SessionLocal, models
from app.config import SECRET_KEY

def register(name, username, password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    hashed_password = hashed_password.decode()
    with SessionLocal() as session:

        user = session.query(models.PwUser).filter_by(email=username).first()
        if user is not None:
            return {"message": "Registration failed: Username already exists"}
        else:
            try:
                user = models.PwUser(name=name, email=username, password=hashed_password)
                session.add(user)
                session.commit()
                return {"message": "Registration successful"}

            except Exception as e:
                return {"message": f"Registration failed: {e}"}

def login(username, password):
    with SessionLocal() as session:
        try:
            user = session.query(models.PwUser).filter_by(email=username).first()
            if user and bcrypt.checkpw(password.encode(), user.password.encode()):
                payload = {
                    "user_id": user.id,
                    "username": user.email,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                return {
                    "success": True,
                    "token": token
                }
            else:
                return {
                    "success": False,
                    "message": "Invalid username or password"
                }

        except Exception as e:
            return {"message": f"Login failed: {e}"}

def get_user(user_id):
    with SessionLocal() as session:
        user = session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}
        return { "success": True, "message": "User updated successfully", "user": user}

def update_user(user_id, user_request):
    with SessionLocal() as session:
        salt = bcrypt.gensalt()
        user = session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        user.email = user_request.email if user_request.email is not None else user.email
        user.password = bcrypt.hashpw(user_request.password.encode(), salt).decode() if user_request.password is not None else user.password
        user.name = user_request.name if user_request.name is not None else user.name
        user.balance = user_request.balance if user_request.balance is not None else user.balance
        session.commit()
        return { "success": True, "message": "User updated successfully", "user": user}
