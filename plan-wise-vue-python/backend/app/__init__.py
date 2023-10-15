import os
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.declarative import declarative_base
from fastapi.middleware.cors import CORSMiddleware


from controller import auth_controller
from controller import category_controller
from controller import expense_controller
from controller import income_controller
from controller import budget_controller

# Create the FastAPI app instance
app = FastAPI(title="FastAPI Example.")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_controller.router, prefix="/api")
app.include_router(category_controller.router, prefix="/api")
app.include_router(expense_controller.router, prefix="/api")
app.include_router(income_controller.router, prefix="/api")
app.include_router(budget_controller.router, prefix="/api")

#static files
current_dir = os.path.dirname(__file__)
template_dir = os.path.join(current_dir, "../../frontend/dist")
templates = Jinja2Templates(directory=template_dir)
assets_dir = os.path.join(current_dir, "../../frontend/dist/assets")
app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
images_dir = os.path.join(current_dir, "../../frontend/dist/images")
app.mount("/images", StaticFiles(directory=images_dir), name="images")

@app.get("/{path:path}")
def index_page(request: Request, path: str = ""):
    return templates.TemplateResponse("index.html", {"request": request})
