# Backend – Sales and Purchases Management System

This directory contains the backend of the Sales and Purchases Management System.

The backend is developed using Python and FastAPI. It provides REST API endpoints to handle business operations and communicate with the MySQL database.

## Technologies Used

- Python
- FastAPI
- SQLAlchemy
- MySQL
- JWT
- Argon2

## Main Responsibilities

- Manage clients and suppliers.
- Manage products and categories.
- Handle sales and purchase operations.
- Manage authentication and authorization.
- Interact with the MySQL database.

## Installation and Execution

```bash
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```