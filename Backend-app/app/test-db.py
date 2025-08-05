import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from db import SessionLocal, engine
    from sqlalchemy import text  # <-- Add this line
    print("Attempting to connect to the database...")
    with engine.connect() as connection:
        print("Database connection successful!")
        db = SessionLocal()
        try:
            result = connection.execute(text("SELECT version();")).fetchone()  # <-- Wrap with text()
            print("\nSuccessfully ran a test query.")
            print(f"Database version: {result[0]}")
            
        finally:
            db.close()
            
except Exception as e:
    print("\nAn error occurred while testing the database connection:")
    print(e)
    sys.exit(1)

