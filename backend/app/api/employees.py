from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import SessionDep
from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeRead

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post(
    "",
    response_model=EmployeeRead,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    payload: EmployeeCreate,
    session: SessionDep,
) -> EmployeeRead:
    # Check duplicates by employee_id or email
    stmt = select(Employee).where(
        (Employee.employee_id == payload.employee_id)
        | (Employee.email == payload.email)
    )
    existing = session.exec(stmt).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with this ID or email already exists",
        )

    employee = Employee(
        employee_id=payload.employee_id,
        full_name=payload.full_name,
        email=payload.email,
        department=payload.department,
    )

    try:
        session.add(employee)
        session.commit()
        session.refresh(employee)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee with this ID or email already exists",
        )

    return employee


@router.get("", response_model=list[EmployeeRead])
def list_employees(session: SessionDep) -> list[EmployeeRead]:
    stmt = select(Employee).order_by(Employee.created_at.desc())
    employees = session.exec(stmt).all()
    return employees


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee_by_id(
    employee_id: int,
    session: SessionDep,
) -> EmployeeRead:
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )
    return employee


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_employee(
    employee_id: int,
    session: SessionDep,
) -> None:
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    session.delete(employee)
    session.commit()
