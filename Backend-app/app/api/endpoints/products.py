from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud, models
from app.database import get_db
from app.api.endpoints.auth import get_current_user

# Create an API router for the product endpoints.
router = APIRouter()

# GET all products (public access).
@router.get("/", response_model=List[schemas.ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

# GET a single product by ID (public access).
@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# CREATE a new product (requires authentication).
@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_product(db=db, product=product)

# UPDATE an existing product (requires authentication).
@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    updated_product = crud.update_product(db, product_id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

# DELETE a product (requires authentication).
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    deleted = crud.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# File: app/main.py
from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine, Base, get_db
from app.api.endpoints import auth, products

# Create the FastAPI application instance.
app = FastAPI(
    title="AuraFlow API",
    description="A secure and responsive backend for the AuraFlow application.",
    version="1.0.0",
)

# Include the API routers from the auth and products modules.
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])

# Event handler to create database tables when the application starts.
@app.on_event("startup")
def on_startup():
    print("Creating database tables...")
    try:
        # Check for existing tables and drop them to start fresh.
        with engine.begin() as conn:
            # We will use this check to see if the table exists before dropping.
            # In production, you would use Alembic for migrations.
            conn.execute(text("DROP TABLE IF EXISTS products;"))
            conn.execute(text("DROP TABLE IF EXISTS users;"))
        # Create all tables defined in models.py.
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"An error occurred during database table creation: {e}")

# Root endpoint.
@app.get("/")
def read_root():
    return {"message": "Welcome to the AuraFlow API!"}
