import os
import boto3
import json
from botocore.exceptions import ClientError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv # Still useful for non-secret environment variables

# Load environment variables from a .env file (if you have other non-secret vars there)
load_dotenv()

# --- AWS Secrets Manager Configuration ---
# You can get these from your Terraform outputs or specify directly.
# For production, it's better to pass these via Kubernetes config maps/secrets or environment variables in the deployment.

# The actual ARN of your primary database secret.
DB_SECRET_ARN = os.getenv("DB_SECRET_ARN", "arn:aws:secretsmanager:eu-west-2:899411341244:secret:Production/eu-west-2/db-credentials-U9BEVi")
AWS_REGION = os.getenv("AWS_REGION", "eu-west-2") # Your primary region (eu-west-2)

# Function to retrieve secret from AWS Secrets Manager
def get_secret():
    secret_name = DB_SECRET_ARN
    region_name = AWS_REGION

    # Create a Secrets Manager client
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
        # DecryptSecretUsingKMSError, InternalServiceError, InvalidParameterException, InvalidRequestException, ResourceNotFoundException
        print(f"Error retrieving secret '{secret_name}': {e}")
        raise e
    else:
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return json.loads(secret) # Parse the JSON string
        else:
            # For binary secret, decode and handle accordingly
            print("Binary secret detected, not supported for this database connection.")
            raise ValueError("Binary secrets are not supported for database credentials.")

# Retrieve the database credentials
try:
    db_credentials = get_secret()
except Exception as e:
    print(f"Failed to load database credentials from Secrets Manager: {e}")
    # In a real application, you might want to log this error and gracefully exit or retry.
    raise RuntimeError("Application cannot start without database credentials.")

# Construct the DATABASE_URL dynamically
# Ensure the retrieved fields match what you stored in Secrets Manager (username, password, host, db_name, port, engine)
try:
    SQLALCHEMY_DATABASE_URL = (
        f"{db_credentials['engine']}://"
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

# Create a database engine.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # Use the psycopg binary driver
    connect_args={"connect_timeout": 10},
    echo=True # Set to False in production for less verbose logging
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
