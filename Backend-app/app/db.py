import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load environment variables from the .env file.
load_dotenv()

# Retrieve the database URL from the environment variables.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create a database engine.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # Use the psycopg binary driver
    connect_args={"connect_timeout": 10},
    echo=True
)

# Create a session local class for each request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models.
Base = declarative_base()

# Dependency to get a database session for each request.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()