from sqlalchemy import func, extract
from app.database import SessionLocal, models

class CategoryService:
    def __init__(self):
        self.session = SessionLocal()

    def create_category(self, user_id, category_name):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return {"success": False,"message": "User not found"}

        category = self.session.query(models.PwCategory).filter_by(user_id=user_id, category_name=category_name).first()
        if category:
            return {"success": False,"message": "Category name already exists"}

        category = models.PwCategory(user_id=user_id, category_name=category_name)
        self.session.add(category)
        self.session.commit()
        return {"success": True,"message": "Category created successfully", "category": category.as_dict()}

    def get_category(self, user_id, category_id):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        category = self.session.query(models.PwCategory).filter_by(id=category_id, user_id=user_id).first()
        if not category:
            return { "success": True, "message": "Category not found or not owned by the user"}

        return {"success": True, "message": "Category retrieved successfully", "category": category}

    def get_categories_by_user(self, user_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        category_expenses = self.session.query(
            models.PwCategory.id,
            models.PwCategory.category_name,
            (func.sum(models.PwBudgetTableExpense.amount) / 12).label('average_monthly_expense'),
        ).outerjoin(
            models.PwBudgetTableExpense, 
            models.PwBudgetTableExpense.category == models.PwCategory.id
        ).filter(
            models.PwCategory.user_id == user_id
        ).group_by(
            models.PwCategory.id
        ).all()

        if not category_expenses:
            return { "success": False, "message": "No categories found for the user"}

        category_expenses = [{"id": id, "category_name": name, "average_monthly_expense": float(expense) if expense else 0} for id, name, expense in category_expenses]

        return {"success": True, "message": "Category retrieved successfully", "category":  category_expenses}

    def update_category(self, user_id, category_id, new_category_name):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        category = self.session.query(models.PwCategory).filter_by(id=category_id, user_id=user_id).first()
        if not category:
            return { "success": False, "message": "Category not found or not owned by the user"}

        category.category_name = new_category_name
        self.session.commit()
        return { "success": True, "message": "Category updated successfully", "category": category}

    def delete_category(self, user_id, category_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        category = self.session.query(models.PwCategory).filter_by(id=category_id, user_id=user_id).first()
        if not category:
            return { "success": False, "message": "Category not found or not owned by the user"}

        self.session.query(models.PwExpense).filter_by(category=category_id).update({models.PwExpense.category: None})
        self.session.delete(category)
        self.session.commit()

        return { "success": True, "message": "Category deleted successfully"}