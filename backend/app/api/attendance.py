from fastapi import APIRouter, HTTPException, Query, status
from datetime import date
from sqlmodel import select, func
from sqlalchemy.exc import IntegrityError

from app.api.deps import SessionDep
from app.models import Attendance, Employee
from app.schemas import AttendanceCreate, AttendanceRead, AttendanceSummary

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post(
    "",
    response_model=AttendanceRead,
    status_code=status.HTTP_201_CREATED,
)
def mark_attendance(
    payload: AttendanceCreate,
    session: SessionDep,
) -> AttendanceRead:
    # Ensure employee exists
    employee = session.get(Employee, payload.employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    attendance = Attendance(
        employee_id=payload.employee_id,
        date=payload.date,
        status=payload.status,
    )

    try:
        session.add(attendance)
        session.commit()
        session.refresh(attendance)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already recorded for this date",
        )

    return attendance


@router.get("", response_model=list[AttendanceRead])
def get_attendance(
    employee_id: int = Query(..., description="Employee DB id"),
    from_date: date | None = Query(None),
    to_date: date | None = Query(None),
    session: SessionDep = None,
) -> list[AttendanceRead]:
    # Ensure employee exists
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    stmt = select(Attendance).where(Attendance.employee_id == employee_id)

    if from_date:
        stmt = stmt.where(Attendance.date >= from_date)
    if to_date:
        stmt = stmt.where(Attendance.date <= to_date)

    stmt = stmt.order_by(Attendance.date.desc())
    records = session.exec(stmt).all()
    return records


@router.get("/summary", response_model=AttendanceSummary)
def get_attendance_summary(
    employee_id: int = Query(...),
    session: SessionDep = None,
) -> AttendanceSummary:
    # Ensure employee exists
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    stmt = (
        select(Attendance.status, func.count(Attendance.id))
        .where(Attendance.employee_id == employee_id)
        .group_by(Attendance.status)
    )
    rows = session.exec(stmt).all()

    total_present = 0
    total_absent = 0
    for status_value, count_value in rows:
        if status_value == "Present":
            total_present = count_value
        elif status_value == "Absent":
            total_absent = count_value

    return AttendanceSummary(
        employee_id=employee_id,
        total_present=total_present,
        total_absent=total_absent,
    )
