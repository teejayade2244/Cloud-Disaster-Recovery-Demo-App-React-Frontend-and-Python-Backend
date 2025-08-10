import os
import boto3
import json
from botocore.exceptions import ClientError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv 

load_dotenv()

DB_SECRET_ARN = os.getenv("DB_SECRET_ARN")
AWS_REGION = os.getenv("AWS_REGION", "eu-west-2")  # Default region if not specified

# Validate that required environment variable is set
if not DB_SECRET_ARN:
    raise RuntimeError("DB_SECRET_ARN environment variable must be set in Kubernetes deployment")

# Function to retrieve secret from AWS Secrets Manager
def get_secret():
    secret_name = DB_SECRET_ARN
    region_name = AWS_REGION

    # Create a Secrets Manager client.
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # Handle exceptions based on error code.
        print(f"Error retrieving secret '{secret_name}': {e}")
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return json.loads(secret) 
        else:
            print("Binary secret detected, not supported for this database connection.")
            raise ValueError("Binary secrets are not supported for database credentials.")

# Retrieve the database credentials
try:
    db_credentials = get_secret()
    print(f"Successfully retrieved database credentials from secret: {DB_SECRET_ARN}")
except Exception as e:
    print(f"Failed to load database credentials from Secrets Manager: {e}")
    raise RuntimeError("Application cannot start without database credentials.")

# Construct the DATABASE_URL dynamically
try:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://" 
        f"{db_credentials['username']}:"
        f"{db_credentials['password']}@"
        f"{db_credentials['host']}:"
        f"{db_credentials['port']}/"
        f"{db_credentials['db_name']}"
    )
    print(f"Successfully constructed DATABASE_URL using secret from {DB_SECRET_ARN}")
except KeyError as e:
    print(f"Missing expected key in database secret: {e}. Ensure secret structure is correct (username, password, host, port, db_name).")
    raise RuntimeError("Invalid database secret structure.")

# Create a database engine.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
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
# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base

# # Remove boto3, json, botocore.exceptions, and get_secret() function if using K8s Secrets
# # Remove load_dotenv() as Kubernetes will manage env vars

# # Get database credentials from environment variables injected by Kubernetes
# DB_USERNAME = os.getenv("DB_USERNAME")
# DB_PASSWORD = os.getenv("DB_PASSWORD")
# DB_HOST = os.getenv("DB_HOST")
# DB_PORT = os.getenv("DB_PORT")
# DB_NAME = os.getenv("DB_NAME")

# if not all([DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
#     raise RuntimeError("Missing one or more database environment variables. Ensure DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, and DB_NAME are set.")

# try:
#     SQLALCHEMY_DATABASE_URL = (
#         f"postgresql+psycopg2://"
#         f"{DB_USERNAME}:"
#         f"{DB_PASSWORD}@"
#         f"{DB_HOST}:"
#         f"{DB_PORT}/"
#         f"{DB_NAME}"
#     )
#     print("Successfully constructed DATABASE_URL from Kubernetes environment variables.")
# except Exception as e:
#     print(f"Error constructing DATABASE_URL: {e}")
#     raise RuntimeError("Failed to construct database URL.")

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL,
#     connect_args={"connect_timeout": 10},
#     echo=True # Set to False in production
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
