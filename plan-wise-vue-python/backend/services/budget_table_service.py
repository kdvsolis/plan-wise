import calendar
from sqlalchemy import and_, asc, func
from app.database import SessionLocal, models
from datetime import datetime

class BudgetService:
    def __init__(self):
        self.session = SessionLocal()

    def get_budgets_in_date_range(self, user_id, start_date_str):
        earliest_date = min(
            self.session.query(func.min(models.PwBudgetTableIncome.date)).scalar(),
            self.session.query(func.min(models.PwBudgetTableExpense.date)).scalar()
        )
        if start_date_str is None:
            start_date = earliest_date.replace(day=1)
        else:
            start_date = datetime.strptime(start_date_str,'%Y-%m-%d').date()

        _, last_day = calendar.monthrange(start_date.year, start_date.month)
        end_date = start_date.replace(day=last_day)
        incomes_in_range = self.session.query(models.PwBudgetTableIncome).filter(and_(models.PwBudgetTableIncome.date >= start_date,
                                                                                    models.PwBudgetTableIncome.date <= end_date,
                                                                                    models.PwBudgetTableIncome.user_id == user_id)).order_by(asc(models.PwBudgetTableIncome.date)).all()
        expenses_in_range = self.session.query(models.PwBudgetTableExpense).filter(and_(models.PwBudgetTableExpense.date >= start_date,
                                                                                        models.PwBudgetTableExpense.date <= end_date,
                                                                                        models.PwBudgetTableExpense.user_id == user_id)).order_by(asc(models.PwBudgetTableExpense.date)).all()
        formatted_data = {}
        for item in incomes_in_range:
            if item.date not in formatted_data:
                formatted_data[item.date] = {"user_id": user_id, "income": [], "expense": [], "notes": ""}
            formatted_data[item.date]["income"].append({key: value for key, value in item.__dict__.items() if key != 'date' and not key.startswith('_')})

        for item in expenses_in_range:
            if item.date not in formatted_data:
                formatted_data[item.date] = {"user_id": user_id, "income": [], "expense": [], "notes": ""}
            formatted_data[item.date]["expense"].append({key: value for key, value in item.__dict__.items() if key != 'date' and not key.startswith('_')})

        return {"success": True,"message": f"Retrieved budgets in date range", 'budgets': dict(sorted(formatted_data.items()))}

    def update_income(self, income):
        record = self.session.query(models.PwBudgetTableIncome).filter_by(id=income['id']).first()
        if record is None:
            return None
        for key, value in income.items():
            setattr(record, key, value)
        self.session.commit()
        return record

    def update_expense(self, expense):
        record = self.session.query(models.PwBudgetTableExpense).filter_by(id=expense['id']).first()
        if record is None:
            return None
        for key, value in expense.items():
            setattr(record, key, value)
        self.session.commit()
        return record

    def get_initial_start_dates(self, user_id):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        income_date = self.session.query(models.PwBudgetTableIncome.date).order_by(models.PwBudgetTableIncome.date).first()
        expense_date = self.session.query(models.PwBudgetTableExpense.date).order_by(models.PwBudgetTableExpense.date).first()

        return {"success": True, "message": "Start dates retrieved successfully", "income_date": income_date["date"], "expense_date": expense_date["date"] }

    def create_note(self, user_id, date, notes):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return {"success": False,"message": "User not found"}

        note = models.PwNotes(user_id=user_id, date=date, notes=notes)
        self.session.add(note)
        self.session.commit()
        return {"success": True,"message": "Note created successfully", "note": note}

    def get_note(self, user_id, note_id):

        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        note = self.session.query(models.PwNotes).filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return { "success": True, "message": "Note not found or not owned by the user"}

        return {"success": True, "message": "Note retrieved successfully", "note": note}

    def get_notes_by_date(self, user_id, date):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}
        notes = self.session.query(models.PwNotes).filter_by(user_id=user_id, date=date).first()
        if not notes:
            return { "success": False, "message": "Notes not found or not owned by the user"}

        return {"success": True, "message": "Notes retrieved successfully", "notes": notes.as_dict()}

    def get_notes_by_user(self, user_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}
        note = self.session.query(models.PwNotes).filter_by(user_id=user_id).all()
        if not note:
            return { "success": False, "message": "Note not found or not owned by the user"}

        return {"success": True, "message": "Note retrieved successfully", "note": note}

    def update_note(self, user_id, note_id, new_notes):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        note = self.session.query(models.PwNotes).filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return { "success": False, "message": "Note not found or not owned by the user"}

        note.notes = new_notes
        self.session.commit()
        return { "success": True, "message": "Note updated successfully", "note": note}

    def update_notes_by_date(self, user_id, date, new_notes):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        notes = self.session.query(models.PwNotes).filter_by(user_id=user_id, date=date).all()
        if not notes:
            return { "success": False, "message": "Notes not found or not owned by the user"}

        for note in notes:
            note.notes = new_notes
        self.session.commit()
        return { "success": True, "message": "Notes updated successfully", "notes": notes}

    def delete_note(self, user_id, note_id):
        user = self.session.query(models.PwUser).filter_by(id=user_id).first()
        if not user:
            return { "success": False, "message": "User not found"}

        note = self.session.query(models.PwNotes).filter_by(id=note_id, user_id=user_id).first()
        if not note:
            return { "success": False, "message": "Note not found or not owned by the user"}

        self.session.delete(note)
        self.session.commit()
        return { "success": True, "message": "Note deleted successfully"}