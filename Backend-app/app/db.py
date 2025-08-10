import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Remove boto3, json, botocore.exceptions, and get_secret() function if using K8s Secrets
# Remove load_dotenv() as Kubernetes will manage env vars

# Get database credentials from environment variables injected by Kubernetes
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

if not all([DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
    raise RuntimeError("Missing one or more database environment variables. Ensure DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, and DB_NAME are set.")

try:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://"
        f"{DB_USERNAME}:"
        f"{DB_PASSWORD}@"
        f"{DB_HOST}:"
        f"{DB_PORT}/"
        f"{DB_NAME}"
    )
    print("Successfully constructed DATABASE_URL from Kubernetes environment variables.")
except Exception as e:
    print(f"Error constructing DATABASE_URL: {e}")
    raise RuntimeError("Failed to construct database URL.")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"connect_timeout": 10},
    echo=True # Set to False in production
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
