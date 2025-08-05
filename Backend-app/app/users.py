# check_users.py

import os
import sys

# Add the parent directory to the path to import db.py
# This assumes db.py is in the same directory as this script.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import SessionLocal, engine, Base
from sqlalchemy import Column, Integer, String

# --- Make sure this User model is identical to the one in your main.py and db.py ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

def get_all_users():
    """Connects to the database and fetches all user records."""
    db = SessionLocal()
    try:
        # Use a list comprehension to fetch and store all users
        users = db.query(User).all()
        return users
    except Exception as e:
        print(f"An error occurred while querying the database: {e}")
        return []
    finally:
        db.close()

if __name__ == "__main__":
    print("Fetching users from the database...")
    users = get_all_users()

    if not users:
        print("No users found or an error occurred.")
    else:
        print("\n--- Found Users ---")
        for user in users:
            print(f"ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Hashed Password: {user.hashed_password[:15]}...") # Truncate for display
            print("-------------------")