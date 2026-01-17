from sqlmodel import SQLModel, create_engine, Session
from .config import get_settings
from sqlalchemy import text, event
from sqlalchemy.engine import Engine
from urllib.parse import urlparse
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

settings = get_settings()


def create_database_if_not_exists() -> None:
    """Create the database if it doesn't exist."""
    # Parse the database URL to get connection parameters
    db_url = str(settings.DATABASE_URL)
    parsed = urlparse(db_url)
    
    db_name = parsed.path.lstrip("/")
    
    # Connection parameters for connecting to postgres system database
    try:
        conn = psycopg2.connect(
            host=parsed.hostname or "localhost",
            port=parsed.port or 5432,
            user=parsed.username,
            password=parsed.password,
            dbname="postgres"  # Connect to postgres DB to create new DB
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
        exists = cursor.fetchone()
        
        if not exists:
            try:
                cursor.execute(f"CREATE DATABASE {db_name}")
                print(f"✓ Database '{db_name}' created successfully")
            except psycopg2.errors.InsufficientPrivilege:
                print(f"⚠ User doesn't have permission to create database '{db_name}'")
                print(f"  Please create it manually with: CREATE DATABASE {db_name};")
        else:
            print(f"✓ Database '{db_name}' already exists")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"⚠ Could not verify database: {e}")
        print(f"  Attempting to continue anyway...")


# Create the engine only after ensuring the database exists
def get_engine():
    """Get the SQLAlchemy engine, creating the database if needed."""
    create_database_if_not_exists()
    return create_engine(
        str(settings.DATABASE_URL),
        echo=False,
    )


engine = get_engine()




def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session
