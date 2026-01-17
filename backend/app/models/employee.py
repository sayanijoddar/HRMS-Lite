from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Employee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True, unique=True, nullable=False)
    full_name: str = Field(nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    department: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
