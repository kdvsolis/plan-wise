# coding: utf-8
from datetime import date
from decimal import Decimal
from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String, JSON, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class PwUser(Base):
    __tablename__ = 'pw_users'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_users_id_seq'::regclass)"))
    email = Column(String(256), nullable=False)
    password = Column(String(256), nullable=False)
    name = Column(String(2048))
    balance = Column(Numeric, default=0)

class PwCategory(Base):
    __tablename__ = 'pw_categories'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_categories_id_seq'::regclass)"))
    category_name = Column(String(1024), nullable=False)
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)

    user = relationship('PwUser')
    def as_dict(self):
        dict_ = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in dict_.items():
            if isinstance(value, Decimal):
                dict_[key] = float(value)
            elif isinstance(value, date):
                dict_[key] = value.isoformat()
        return dict_

class PwIncome(Base):
    __tablename__ = 'pw_income'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_income_id_seq'::regclass)"))
    source = Column(String(1024), nullable=False)
    amount = Column(Numeric)
    start_date = Column(Date)
    frequency = Column(Integer)
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)

    user = relationship('PwUser')

    def as_dict(self):
        dict_ = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in dict_.items():
            if isinstance(value, Decimal):
                dict_[key] = float(value)
            elif isinstance(value, date):
                dict_[key] = value.isoformat()
        return dict_

class PwExpense(Base):
    __tablename__ = 'pw_expenses'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_expenses_id_seq'::regclass)"))
    expenses = Column(String(1024), nullable=False)
    amount = Column(Numeric)
    start_date = Column(Date)
    frequency = Column(Integer)
    category = Column(ForeignKey('pw_categories.id'))
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)

    pw_category = relationship('PwCategory')
    user = relationship('PwUser')

    def as_dict(self):
        dict_ = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in dict_.items():
            if isinstance(value, Decimal):
                dict_[key] = float(value)
            elif isinstance(value, date):
                dict_[key] = value.isoformat()
        return dict_


class PwNotes(Base):
    __tablename__ = 'pw_notes'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_notes_id_seq'::regclass)"))
    date = Column(Date, nullable=False)
    notes = Column(String(1024))
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)

    user = relationship('PwUser')
    def as_dict(self):
        dict_ = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in dict_.items():
            if isinstance(value, Decimal):
                dict_[key] = float(value)
            elif isinstance(value, date):
                dict_[key] = value.isoformat()
        return dict_


class PwBudgetTableIncome(Base):
    __tablename__ = 'pw_budget_table_income'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_budget_table_income_id_seq'::regclass)"))
    date = Column(Date)
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)
    income_id = Column(Integer)
    source = Column(String(1024), nullable=False)
    amount = Column(Numeric)
    start_date = Column(Date)
    frequency = Column(Integer)
    user = relationship('PwUser')

class PwBudgetTableExpense(Base):
    __tablename__ = 'pw_budget_table_expense'

    id = Column(Integer, primary_key=True, server_default=text("nextval('pw_budget_table_expense_id_seq'::regclass)"))
    date = Column(Date)
    user_id = Column(ForeignKey('pw_users.id'), nullable=False)
    expense_id = Column(Integer)
    expenses = Column(String(1024), nullable=False)
    amount = Column(Numeric)
    start_date = Column(Date)
    frequency = Column(Integer)
    category = Column(Integer)
    user = relationship('PwUser')