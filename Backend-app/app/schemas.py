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