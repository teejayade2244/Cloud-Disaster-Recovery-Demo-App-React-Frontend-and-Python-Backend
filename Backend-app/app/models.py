from sqlalchemy import Column, Integer, String, DECIMAL
from app.database import Base

# SQLAlchemy model for the 'users' table.
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# SQLAlchemy model for the 'products' table.
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(DECIMAL(10, 2))
    image_url = Column(String)

# File: app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from decimal import Decimal

# Pydantic schema for creating a user.
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Pydantic schema for a user response, excluding the password.
class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# Pydantic schema for creating or updating a product.
class ProductCreate(BaseModel):
    name: str
    description: str
    price: Decimal
    image_url: Optional[str] = None

# Pydantic schema for a product response.
class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: Decimal
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

# Pydantic schema for the login request.
class TokenRequest(BaseModel):
    email: EmailStr
    password: str

# Pydantic schema for the token response.
class Token(BaseModel):
    access_token: str
    token_type: str