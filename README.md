# Task-3-Ditya
Bulit the Database-Integrated Backend for Scribble (Project 3)

This task marks the culmination of the backend persistence phase. The iteration successfully transitions Scribble from volatile, temporary file storage to a resilient, permanent **SQLite** relational database powered by the **Sequelize ORM**. It fulfills the industrial mandate for "Data Longevity," ensuring that every note, tag, and archival state is securely vaulted in structured relational storage.

---

## 📂 Project Architecture Blueprint

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

## 🛠️Database Schema & ORM Model
The system utilizes a structured schema to enforce referential integrity. Every note instance is assigned a UUID primary key, ensuring absolute distinctness within the vault.

Field Name,Data Type,Constraints,Purpose
id,UUID,"Primary Key, Auto-gen",Unique record identifier
title,STRING,"Not Null, Not Empty",Core content reference
tags,STRING,Comma-Separated,Taxonomy and filter categorisation
content,TEXT,Nullable,Primary note body text
archived,BOOLEAN,Default: false,State management flag

## 📡Updated RESTful API Contract
All operations now leverage the Sequelize ORM to execute high-performance SQL queries.

HTTP Method,Endpoint,SQL Logic Operation
GET,/api/notes,findAll with Op.or search filtering
POST,/api/notes,Note.create with validation hooks
PUT,/api/notes/:id,Note.findByPk followed by save()
PATCH,/api/notes/:id/archive,Atomic boolean toggle update
DELETE,/api/notes/:id,Note.destroy by primary key

<img width="3999" height="2658" alt="image" src="https://github.com/user-attachments/assets/53f8d0c4-bc90-4875-8138-eaa6b62c3089" />

## 🚀Deployment & Initialization Protocol
Follow these steps to initialize your new persistence layer:

-> Environment Setup: Navigate to your backend directory in the VS Code terminal:
cd backend
-> Sync Dependencies: Run the install command to download the ORM and Database driver:
npm install
-> Boot the Engine: Start the API server:
npm start

## 🛡️Security & Data Integrity Guards
-> Referential Integrity: By migrating to a structured database, we eliminate the risks of file-read race conditions inherent in JSON-based storage.

-> XSS & Input Sanitization: The schema handles data sanitization at the model level before committing to permanent SQL storage.

-> ORM Shield: Using Sequelize acts as a security barrier, preventing raw SQL injection vulnerabilities by parameterizing all queries sent to the database engine.

Developed for the **2026 Summer Internship | Database Integration Milestone Completed**.
