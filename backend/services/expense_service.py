from app.database import SessionLocal, models
from util.date_data_generator import group_by_date
from datetime import datetime

class ExpenseService:
    def __init__(self):
        self.session = SessionLocal()

    def create_expense(self, user_id, expenses):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return {"success": False,"message": "User not found"}

        expense = models.PwExpense(
            user_id=user_id,
            expenses=expenses.expenses,
            amount=expenses.amount,
            start_date=expenses.start_date,
            frequency=expenses.frequency,
            category=expenses.category
        )
        self.session.add(expense)
        self.session.commit()
        expense_id = expense.id

        budget_data = group_by_date([{
            "expenses": expenses.expenses,
            "expense_id": expense_id,
            "amount": expenses.amount,
            "start_date": expenses.start_date,
            "frequency": expenses.frequency,
            "category": expenses.category
        }])
        budget_expenses = []
        for date, expenses in budget_data.items():
            for exp in expenses:
                budget_income = models.PwBudgetTableExpense(
                    date=date,
                    user_id=user_id,
                    expense_id=expense_id,
                    expenses=exp["expenses"],
                    amount=exp["amount"],
                    start_date=exp["start_date"],
                    category=exp["category"],
                    frequency=exp["frequency"]
                )
                budget_expenses.append(budget_income)

        self.session.add_all(budget_expenses)
        self.session.commit()
        return {"success": True,"message": "Expense created successfully", "expense": expense.as_dict()}


    def get_expense(self, user_id, expense_id):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        expense = self.session.query(models.PwExpense).filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            return { "success": True, "message": "Expense not found or not owned by the user"}

        return {"success": True, "message": "Expense retrieved successfully", "expense": expense}

    def get_expenses_by_user(self, user_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}
        expense = self.session.query(models.PwExpense).filter_by(user_id=user_id).order_by(models.PwExpense.start_date).all()
        if not expense:
            return { "success": False, "message": "Expense not found or not owned by the user"}

        return {"success": True, "message": "Expense retrieved successfully", "expense": expense}

    def update_expense(self, user_id, expense_id, expense_request):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        expense = self.session.query(models.PwExpense).filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            return { "success": False, "message": "Expense not found or not owned by the user"}

        expense.expenses = expense_request.expenses if expense_request.expenses is not None else expense.expenses
        expense.amount = expense_request.amount if expense_request.amount is not None else expense.amount
        expense.start_date = expense_request.start_date if expense_request.start_date is not None else expense.start_date
        expense.frequency = expense_request.frequency if expense_request.frequency is not None else expense.frequency
        expense.category = expense_request.category if expense_request.category is not None else expense.category
    
        self.session.commit()
        
        self.session.query(models.PwBudgetTableExpense).filter(
            models.PwBudgetTableExpense.date > str(datetime.now().date()),
            models.PwBudgetTableExpense.expense_id == expense_id, 
            models.PwBudgetTableExpense.user_id == user_id
        ).delete(synchronize_session=False)
        self.session.commit()

        budget_data = group_by_date([{
            "expenses": expense_request.expenses,
            "expense_id": expense_id,
            "amount": expense_request.amount,
            "start_date": expense_request.start_date,
            "frequency": expense_request.frequency,
            "category": expense_request.category
        }])

        budget_expenses = []
        for date, expenses in budget_data.items():
            for exp in expenses:
                budget_income = models.PwBudgetTableExpense(
                    date=date,
                    user_id=user_id,
                    expense_id=expense_id,
                    expenses=exp["expenses"],
                    amount=exp["amount"],
                    start_date=exp["start_date"],
                    category=exp["category"],
                    frequency=exp["frequency"]
                )
                budget_expenses.append(budget_income)
        self.session.add_all(budget_expenses)
        self.session.commit()

        return { "success": True, "message": "Expense updated successfully", "expense": expense}

    def delete_expense(self, user_id, expense_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        expense = self.session.query(models.PwExpense).filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            return { "success": False, "message": "Expense not found or not owned by the user"}

        self.session.delete(expense)
        self.session.commit()

        self.session.query(models.PwBudgetTableExpense).filter(
            models.PwBudgetTableExpense.date > str(datetime.now().date()),
            models.PwBudgetTableExpense.expense_id == expense_id, 
            models.PwBudgetTableExpense.user_id == user_id
        ).delete(synchronize_session=False)
        self.session.commit()

        return { "success": True, "message": "Expense deleted successfully"}