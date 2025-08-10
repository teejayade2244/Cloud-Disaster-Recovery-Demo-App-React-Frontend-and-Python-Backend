import os
import boto3
import json
from botocore.exceptions import ClientError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

DB_SECRET_ARN = os.getenv("DB_SECRET_ARN", "arn:aws:secretsmanager:eu-west-2:899411341244:secret:Production/eu-west-2/db-credentials-U9BEVi")
AWS_REGION = os.getenv("AWS_REGION", "eu-west-2")

def get_secret():
    secret_name = DB_SECRET_ARN
    region_name = AWS_REGION
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        print(f"Error retrieving secret '{secret_name}': {e}")
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return json.loads(secret)
        else:
            print("Binary secret detected, not supported for this database connection.")
            raise ValueError("Binary secrets are not supported for database credentials.")

try:
    db_credentials = get_secret()
except Exception as e:
    print(f"Failed to load database credentials from Secrets Manager: {e}")
    raise RuntimeError("Application cannot start without database credentials.")

try:
    # --- CRITICAL CHANGE HERE: Explicitly specify 'postgresql+psycopg2' dialect ---
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://" # Force psycopg2 dialect
        f"{db_credentials['username']}:"
        f"{db_credentials['password']}@"
        f"{db_credentials['host']}:"
        f"{db_credentials['port']}/"
        f"{db_credentials['db_name']}"
    )
    print(f"Successfully constructed DATABASE_URL using secret from {DB_SECRET_ARN}")
except KeyError as e:
    print(f"Missing expected key in database secret: {e}. Ensure secret structure is correct.")
    raise RuntimeError("Invalid database secret structure.")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"connect_timeout": 10},
    echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
