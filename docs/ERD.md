# Data Modeling - Leave Management System

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   Employees     │         │   LeaveTypes    │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────┤ id (PK)         │
│ name            │         │ name            │
│ email           │         │ description     │
│ department      │         │ days_allowed    │
│ joining_date    │         └─────────────────┘
│ created_at      │                  │
│ updated_at      │                  │
└─────────────────┘                  │
         │                           │
         │ ┌─────────────────────────┘
         ▼ ▼
┌─────────────────┐
│ LeaveRequests   │
├─────────────────┤
│ id (PK)         │
│ employee_id (FK)│
│ leave_type_id   │
│ start_date      │
│ end_date        │
│ reason          │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│ LeaveBalances   │
├─────────────────┤
│ id (PK)         │
│ employee_id (FK)│
│ leave_type_id   │
│ balance         │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

## Database Tables

### 1. Employees Table
Stores employee information.

| Column Name   | Data Type     | Constraints                     | Description              |
|---------------|---------------|---------------------------------|--------------------------|
| id            | SERIAL        | PRIMARY KEY                     | Unique employee ID       |
| name          | VARCHAR(100)  | NOT NULL                        | Employee full name       |
| email         | VARCHAR(100)  | NOT NULL, UNIQUE                | Employee email address   |
| department    | VARCHAR(50)   | NOT NULL                        | Employee department      |
| joining_date  | DATE          | NOT NULL                        | Employee joining date    |
| created_at    | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record creation time     |
| updated_at    | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record last update time  |

**Indexes:**
- Primary Key: id
- Unique: email
- Index: department

### 2. LeaveTypes Table
Stores different types of leaves available in the system.

| Column Name    | Data Type     | Constraints                     | Description               |
|----------------|---------------|---------------------------------|---------------------------|
| id             | SERIAL        | PRIMARY KEY                     | Unique leave type ID      |
| name           | VARCHAR(50)   | NOT NULL, UNIQUE                | Name of leave type        |
| description    | TEXT          |                                 | Description of leave type |
| days_allowed   | INTEGER       | NOT NULL, DEFAULT 0             | Default days allocated    |
| created_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record creation time      |
| updated_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record last update time   |

**Indexes:**
- Primary Key: id
- Unique: name

### 3. LeaveRequests Table
Stores leave requests made by employees.

| Column Name    | Data Type     | Constraints                     | Description                    |
|----------------|---------------|---------------------------------|--------------------------------|
| id             | SERIAL        | PRIMARY KEY                     | Unique leave request ID        |
| employee_id    | INTEGER       | NOT NULL, FOREIGN KEY           | Reference to employee          |
| leave_type_id  | INTEGER       | NOT NULL, FOREIGN KEY           | Reference to leave type        |
| start_date     | DATE          | NOT NULL                        | Leave start date               |
| end_date       | DATE          | NOT NULL                        | Leave end date                 |
| reason         | TEXT          |                                 | Reason for leave               |
| status         | VARCHAR(20)   | NOT NULL, DEFAULT 'PENDING'     | Status (PENDING/APPROVED/REJECTED) |
| created_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record creation time           |
| updated_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record last update time        |

**Indexes:**
- Primary Key: id
- Foreign Key: employee_id → employees.id
- Foreign Key: leave_type_id → leavetypes.id
- Index: status
- Composite Index: employee_id, status

### 4. LeaveBalances Table
Stores current leave balances for employees.

| Column Name    | Data Type     | Constraints                     | Description                    |
|----------------|---------------|---------------------------------|--------------------------------|
| id             | SERIAL        | PRIMARY KEY                     | Unique balance record ID       |
| employee_id    | INTEGER       | NOT NULL, FOREIGN KEY           | Reference to employee          |
| leave_type_id  | INTEGER       | NOT NULL, FOREIGN KEY           | Reference to leave type        |
| balance        | DECIMAL(5,2)  | NOT NULL, DEFAULT 0             | Current leave balance          |
| created_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record creation time           |
| updated_at     | TIMESTAMP     | NOT NULL, DEFAULT CURRENT_TIME  | Record last update time        |

**Indexes:**
- Primary Key: id
- Foreign Key: employee_id → employees.id
- Foreign Key: leave_type_id → leavetypes.id
- Composite Index: employee_id, leave_type_id

## Relationships

1. **Employees ↔ LeaveRequests** (One-to-Many)
   - One employee can have multiple leave requests
   - Foreign key: leave_requests.employee_id references employees.id

2. **LeaveTypes ↔ LeaveRequests** (One-to-Many)
   - One leave type can be used in multiple leave requests
   - Foreign key: leave_requests.leave_type_id references leavetypes.id

3. **Employees ↔ LeaveBalances** (One-to-Many)
   - One employee can have multiple leave balances (one per leave type)
   - Foreign key: leave_balances.employee_id references employees.id

4. **LeaveTypes ↔ LeaveBalances** (One-to-Many)
   - One leave type can have multiple balance records (one per employee)
   - Foreign key: leave_balances.leave_type_id references leavetypes.id

## Keys and Indexes

### Primary Keys
- All tables have SERIAL primary keys for unique identification

### Foreign Keys
- Enforce referential integrity between related tables
- Cascade updates but restrict deletions to maintain data integrity

### Indexes
- Primary key indexes for fast lookups
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- Unique indexes for email and leave type names

## Sample Data

### LeaveTypes (Pre-populated)
| id | name        | description           | days_allowed |
|----|-------------|-----------------------|--------------|
| 1  | Annual      | Annual leave          | 20           |
| 2  | Sick        | Sick leave            | 10           |
| 3  | Maternity   | Maternity leave       | 90           |
| 4  | Paternity   | Paternity leave       | 15           |

This data model provides a solid foundation for the leave management system while allowing for future extensions and scalability.