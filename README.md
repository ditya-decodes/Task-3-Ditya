# Task-3-Ditya
Bulit the Database-Integrated Backend for Scribble

## 📂Project Architecture Blueprint

```text
scribble-workspace/
│
├── backend/
│   ├── data/
│   │   └── scribble.sqlite    # Permanent SQL database vault
│   ├── package.json           # ORM & Driver dependencies (Sequelize + SQLite3)
│   ├── database.js            # ORM Schema definition & persistence bridge
│   └── server.js              # RESTful API engine with SQL CRUD operations
│
└── frontend/                  # Responsive interface (unchanged)
```

## 🛠️Database Schema & ORM Model
The system utilizes a structured schema to enforce referential integrity. Every note instance is assigned a UUID primary key, ensuring absolute distinctness within the vault.

| Field Name | Data Type | Constraints | Purpose |
| :--- | :--- | :--- | :--- |
| **id** | UUID | Primary Key | Unique record identifier |
| **title** | STRING | Not Null | Core note title |
| **tags** | STRING | Optional | Filter categorization |
| **content** | TEXT | Nullable | Primary note body text |

---

## 📡Updated RESTful API Contract
All operations now leverage the Sequelize ORM to execute high-performance SQL queries.

* **GET** `/api/notes` -> Fetches all notes using Sequelize `findAll`
* **POST** `/api/notes` -> Creates a new note with `Note.create`
* **DELETE** `/api/notes/:id` -> Destroys a note by primary key

---

## 🚀 Deployment & Initialization Protocol

1. Environment Setup: Navigate to your backend directory in the VS Code terminal:
   ```bash
   cd backend
2. Sync Dependencies: Run the install command to download the ORM and Database driver:
   ```bash
   npm install
3. Boot the Engine: Start the API server:
   ```bash
   npm start

---

## 🛡️Security & Data Integrity Guards
->**Referential Integrity:** By migrating to a structured database, we eliminate the risks of file-read race conditions inherent in JSON-based storage.

->**XSS & Input Sanitization:** The schema handles data sanitization at the model level before committing to permanent SQL storage.

->**ORM Shield:** Using Sequelize acts as a security barrier, preventing raw SQL injection vulnerabilities by parameterizing all queries sent to the database engine.

---
Developed for the 2026 Full Stack Summer Internship | Database Integration Milestone Completed

