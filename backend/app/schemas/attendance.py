from datetime import date
from typing import Literal

from pydantic import BaseModel


class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: Literal["Present", "Absent"]


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceRead(AttendanceBase):
    id: int

    class Config:
        from_attributes = True


class AttendanceSummary(BaseModel):
    employee_id: int
    total_present: int
    total_absent: int
