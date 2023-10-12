from sqlalchemy import and_
from datetime import datetime
from app.database import SessionLocal, models
from util.date_data_generator import group_by_date

class IncomeService:
    def __init__(self):
        self.session = SessionLocal()

    def create_income(self, user_id, income_request):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return {"success": False,"message": "User not found"}

        income = models.PwIncome(
            user_id=user_id,
            source=income_request.source,
            amount=income_request.amount,
            start_date=income_request.start_date,
            frequency=income_request.frequency
        )
        self.session.add(income)
        self.session.commit()
        income_id = income.id

        budget_data = group_by_date([{
            "source": income_request.source,
            "income_id": income_id,
            "amount": income_request.amount,
            "start_date": income_request.start_date,
            "frequency": income_request.frequency
        }])
        budget_incomes = []
        for date, incomes in budget_data.items():
            for inc in incomes:
                budget_income = models.PwBudgetTableIncome(
                    date=date,
                    user_id=user_id,
                    income_id=income_id,
                    source=inc["source"],
                    amount=inc["amount"],
                    start_date=inc["start_date"],
                    frequency=inc["frequency"]
                )
                budget_incomes.append(budget_income)

        self.session.add_all(budget_incomes)
        self.session.commit()

        return {"success": True, "message": "Income and budget incomes created successfully", "income": income.as_dict()}

    def get_income(self, user_id, income_id):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        income = self.session.query(models.PwIncome).filter_by(id=income_id, user_id=user_id).first()
        if not income:
            return { "success": True, "message": "Income not found or not owned by the user"}

        return {"success": True, "message": "Income retrieved successfully", "income": income}

    def get_income_by_user(self, user_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}
        income = self.session.query(models.PwIncome).filter_by(user_id=user_id).order_by(models.PwIncome.start_date).all()
        if not income:
            return { "success": False, "message": "Income not found or not owned by the user"}

        return {"success": True, "message": "Income retrieved successfully", "income": income}

    def update_income(self, user_id, income_id, income_request):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        income = self.session.query(models.PwIncome).filter_by(id=income_id, user_id=user_id).first()
        if not income:
            return { "success": False, "message": "Income not found or not owned by the user"}

        income.source = income_request.source if income_request.source is not None else income.source
        income.amount = income_request.amount if income_request.amount is not None else income.amount
        income.start_date = income_request.start_date if income_request.start_date is not None else income.start_date
        income.frequency = income_request.frequency if income_request.frequency is not None else income.frequency

        self.session.commit()

        self.session.query(models.PwBudgetTableIncome).filter(
            models.PwBudgetTableIncome.date > str(datetime.now().date()),
            models.PwBudgetTableIncome.income_id == income_id, 
            models.PwBudgetTableIncome.user_id == user_id
        ).delete(synchronize_session=False)
        self.session.commit()

        budget_data = group_by_date([{
            "source": income_request.source,
            "income_id": income_id,
            "amount": income_request.amount,
            "start_date": income_request.start_date,
            "frequency": income_request.frequency
        }])

        budget_incomes = []
        for date, incomes in budget_data.items():
            if datetime.now().date() > datetime.strptime(date,'%Y-%m-%d').date():
                continue
            for inc in incomes:
                budget_income = models.PwBudgetTableIncome(
                    date=date,
                    user_id=user_id,
                    income_id=income_id,
                    source=inc["source"],
                    amount=inc["amount"],
                    start_date=inc["start_date"],
                    frequency=inc["frequency"]
                )
                budget_incomes.append(budget_income)

        self.session.add_all(budget_incomes)
        self.session.commit()

        return { "success": True, "message": "Income updated successfully", "income": income}

    def delete_income(self, user_id, income_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        income = self.session.query(models.PwIncome).filter_by(id=income_id, user_id=user_id).first()
        if not income:
            return { "success": False, "message": "Income not found or not owned by the user"}

        self.session.delete(income)
        self.session.commit()
        self.session.query(models.PwBudgetTableIncome).filter(
            models.PwBudgetTableIncome.date > str(datetime.now().date()),
            models.PwBudgetTableIncome.income_id == income_id, 
            models.PwBudgetTableIncome.user_id == user_id
        ).delete(synchronize_session=False)
        self.session.commit()

        return { "success": True, "message": "Income deleted successfully"}