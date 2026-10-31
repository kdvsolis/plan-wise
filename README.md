# Plan Wise

Plan Wise is a full-stack planning and management application designed to help users organize tasks, manage schedules, and handle project-related data in an efficient and structured way. The project is built with a modern multi-layer architecture that separates concerns between the frontend, backend, and data layer, making it easier to scale and adapt across different stack combinations.

This repository is designed for flexibility and extensibility, supporting multiple frontend/backend variations such as React + Node, Vue + Python, or React + PHP.

## Features

- Task and planning management
- Responsive dashboard interface
- RESTful backend API
- Persistent database storage
- Docker-ready development setup
- Flexible architecture for multiple tech stacks
- Local environment onboarding
- Project and schedule tracking

## Tech Stack

Depending on the project variant, Plan Wise may use:

- Frontend: React or Vue
- Backend: Node.js, Python (FastAPI), or PHP (Laravel)
- Database: PostgreSQL or MySQL
- Containerization: Docker
- API Communication: REST / JSON

## Architecture Overview

Plan Wise follows a layered architecture pattern that separates the application into distinct responsibilities:

- Frontend Layer: provides the user interface and handles user interactions
- API Layer: exposes application logic and business operations
- Business Logic Layer: processes planning and data operations
- Data Access Layer: communicates with the database
- Database Layer: stores application data persistently

This separation improves maintainability, allows easier testing, and makes it simpler to swap or extend components without disrupting the overall system.

### High-Level Architecture

```text
+----------------------+
|      Frontend        |
|  React / Vue App     |
|  - UI Components     |
|  - User Interaction  |
+----------+-----------+
           |
           | HTTP / API Requests
           v
+----------------------+
|       Backend        |
|  Node / Python /     |
|  PHP API Services    |
|  - Route Handling    |
|  - Business Logic    |
|  - Validation        |
+----------+-----------+
           |
           | Query / Mutation
           v
+----------------------+
|      Database        |
|  PostgreSQL / MySQL |
|  - Users             |
|  - Tasks             |
|  - Plans             |
|  - Records          |
+----------------------+
