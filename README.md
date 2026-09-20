# Expense Tracker App 💰

[![Java](https://img.shields.io/badge/Language-Java-orange)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Framework-Spring%20Boot-brightgreen)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML/CSS/JS-yellow)](#)

A **full-stack Expense Tracker application** built with **Spring Boot**, **MySQL**, and **JavaScript**.
Users can register, log in, add transactions, and view a dynamic balance, income, and expense report.

---

## Features

### User
- Register and log in
- Add income and expense transactions (positive amount = income, negative = expense)
- View transaction history
- See a dynamically calculated balance, income, and expense total
- Delete individual transactions

### Backend
- RESTful APIs for user authentication and transaction management
- Layered architecture: Controller → Service → Repository → Database
- MySQL database integration via Spring Data JPA / Hibernate
- Tables (`users`, `transaction`) auto-created on first run via `spring.jpa.hibernate.ddl-auto=update`

### Frontend
- Static HTML pages with CSS styling and vanilla JavaScript (no framework)
- Forms for login, registration, and adding transactions
- Session persistence via browser `localStorage`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17+, Spring Boot 3.5.x, Spring Data JPA |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Database | MySQL |
| DB Client | **DBeaver** (used for creating and inspecting the database) |
| Build Tool | Maven |
| IDE | IntelliJ IDEA (backend), VS Code or IntelliJ (frontend) |

---

## Prerequisites

Before installing, make sure you have:

- **JDK 17 or newer** — check with `java --version`
- **Maven** — check with `mvn -version` (or use the IntelliJ-managed Maven if you don't install it separately)
- **MySQL Server** installed and running locally
- **DBeaver** — [download here](https://dbeaver.io/download/) — used to create and view the database
- **Git**

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Jiya022/expense-tracker.git
cd expense-tracker/Expense-Tracker
```

### 2. Create the database using DBeaver
1. Open DBeaver → **Database → New Database Connection** → choose **MySQL**.
2. Set Host: `localhost`, Port: `3306`, Username: `root`, Password: *(your MySQL password)*.
3. Click **Test Connection** (let DBeaver download the MySQL driver if prompted), then **Finish**.
4. Open a SQL editor on the new connection and run:
```sql
CREATE DATABASE expense_tracker;
```
You don't need to create tables manually — Hibernate creates `users` and `transaction` automatically the first time the backend runs successfully.

### 3. Configure the backend
Create a file at `src/main/resources/application.properties` (this file is intentionally excluded from git via `.gitignore` since it holds credentials):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 4. Run the backend
Open the project in IntelliJ IDEA and run `ExpenseTrackerApplication.java`, **or** from the terminal:
```bash
mvn clean install
mvn spring-boot:run
```
The server starts on **http://localhost:8080**.

### 5. Verify the tables in DBeaver
Refresh the `expense_tracker` database in DBeaver — you should now see the `users` and `transaction` tables, auto-created with the correct columns and a foreign key linking them.

### 6. Run the frontend
Open `Expense-Tracker-Frontend/register.html` directly in a browser, or serve the folder for a smoother experience:
```bash
cd Expense-Tracker-Frontend
npx serve .
```
Register a user, log in, and start adding transactions.

---

## Project Structure

```
Expense-Tracker/
├── pom.xml
├── src/main/java/.../Tracker/
│   ├── model/          # User, Transaction entity classes
│   ├── repository/     # Spring Data JPA repositories
│   ├── service/        # Business logic
│   ├── controller/     # REST API endpoints
│   └── ExpenseTrackerApplication.java
├── src/main/resources/
│   └── application.properties   # not committed — create this yourself
└── Expense-Tracker-Frontend/
    ├── login.html
    ├── register.html
    ├── expense_tracker.html
    ├── script.js
    └── styles.css
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ExpTrack/register` | Register a new user |
| POST | `/ExpTrack/login` | Log in with username + password |
| GET | `/ExpTrack/transactions/{username}` | Get all transactions for a user |
| POST | `/ExpTrack/transactions/{username}` | Add a transaction for a user |
| DELETE | `/ExpTrack/transactions/{username}/{id}` | Delete a specific transaction |

---

## Known Limitations

- Passwords are stored in plain text — not hashed (e.g. with BCrypt).
- No token-based authentication (e.g. JWT); the frontend simply stores the username in `localStorage` and the backend trusts it.
- Balance/income/expense totals are calculated client-side in JavaScript, not stored or computed by the backend.
