from datetime import datetime
from pydantic import BaseModel, EmailStr


class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # for SQLModel compatibility (Pydantic v2 style)
