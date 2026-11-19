# 🛒 Sales and Purchases Management System

A full-stack web application developed to simplify and centralize the management of sales, purchases, products, clients, and suppliers.

The application provides a dedicated administration interface that enables administrators to manage business operations efficiently through a user-friendly web interface.

## ✨ Features

- **Dashboard:** Overview of business activities and key information.
- **Client Management:** Add, view, update, and manage clients.
- **Supplier Management:** Manage supplier information.
- **Category Management:** Organize products into categories.
- **Product Management:** Manage products, prices (HT/TTC), VAT (TVA), and stock quantities.
- **Sales Management:** Record and manage sales operations.
- **Purchase Management:** Record and manage purchase operations.
- **Authentication and Security:** Administrator authentication using JWT and Argon2 password hashing.
- **Profile Management:** Manage administrator profile information.

## 🛠️ Technologies Used

| Component | Technologies |
|---|---|
| Frontend | Angular, TypeScript |
| Styling | Tailwind CSS, Flowbite |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | MySQL |
| Authentication | JWT, Argon2 |
| API Testing | Postman |
| Development Tools | VS Code, XAMPP, Git, GitHub |

## 📁 Project Structure

```text
gestionnaire-achats-ventes/
│
├── frontend/              # Angular application
│
├── backend/               # FastAPI application
│
├── database/              # Database files
│   └── project.sql        # SQL database export
│
├── .gitignore
└── README.md
```

## 🚀 Installation and Configuration

### Prerequisites

Make sure the following tools are installed:

- Python 3
- Node.js and npm
- Angular CLI
- XAMPP
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sarrakhachira569-cmyk/gestionnaire-achats-ventes.git

cd gestionnaire-achats-ventes
```

### 2. Database Configuration

1. Open XAMPP Control Panel.
2. Start Apache and MySQL.
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create a new database named `project`.
5. Select the `project` database.
6. Open the Import tab.
7. Choose the `database/project.sql` file.
8. Click Import to execute the SQL file.

Make sure the database connection settings in the backend configuration match your local MySQL configuration.

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv env
```

Activate the virtual environment on Windows:

```bash
env\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Open the application in your browser:

http://localhost:4200

## 🧪 API Testing

Postman is used to test and verify the backend REST API endpoints, including requests and responses between the frontend and backend services.

## 🔐 Application Access

The application is designed exclusively for administration purposes.

Administrators must authenticate themselves to access the application's management features and perform authorized operations.

## 👩‍💻 About the Project

This project was developed as a full-stack web development project, combining an Angular frontend, a FastAPI backend, and a MySQL relational database.

Its modular architecture facilitates maintenance, organization, and future development.

---

**Developed with Angular, Python, FastAPI, and MySQL.**