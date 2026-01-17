from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel
from sqlalchemy import UniqueConstraint


class Attendance(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="uq_employee_date"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: int = Field(foreign_key="employee.id", index=True, ondelete="CASCADE")
    date: date
    status: str
