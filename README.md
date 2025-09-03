# Leave Management System

A comprehensive Leave Management System built with Next.js, TypeScript, and Tailwind CSS. This system allows HR teams to manage employee information, process leave requests, and track leave balances.

## Features

- Employee management (add, view employees)
- Leave request submission
- Leave approval/rejection workflow
- Leave balance tracking
- Dashboard with employee and leave information

## System Design

### High Level Design
The system follows a client-server architecture:
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Data Storage**: In-memory storage (for demonstration purposes)

### Data Model
The system uses the following entities:
- **Employees**: Store employee information (name, email, department, joining date)
- **Leave Types**: Different types of leaves (Annual, Sick, Maternity, Paternity)
- **Leave Requests**: Employee leave requests with status tracking
- **Leave Balances**: Current leave balances for each employee and leave type

## Edge Cases Handled

1. Applying for leave before joining date
2. Applying for more days than available balance
3. Overlapping leave requests
4. Employee not found
5. Invalid dates (end date before start date)
6. Duplicate employee emails
7. Future joining dates
8. Invalid email formats
9. Missing required fields
10. Status changes for already approved/rejected requests

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd leave-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
leave-management-system/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── employees/    # Employee management pages
│   │   ├── leave/        # Leave management pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── lib/              # Business logic and services
│   ├── types/            # TypeScript types
│   └── components/       # Reusable components
├── docs/                 # Documentation
├── public/               # Static assets
└── styles/               # Global styles
```

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee

### Leave Requests
- `GET /api/leave-requests` - Get all leave requests
- `GET /api/leave-requests?employeeId={id}` - Get leave requests for an employee
- `POST /api/leave-requests` - Create a new leave request
- `PATCH /api/leave-requests/{id}` - Update leave request status

### Leave Types
- `GET /api/leave-types` - Get all leave types

### Leave Balances
- `GET /api/leave-balances?employeeId={id}` - Get leave balances for an employee

## Assumptions

1. The system is designed for a company with 50 employees initially
2. Data is stored in-memory and will be lost when the server restarts
3. All users have HR privileges (no user authentication implemented)
4. Leave days are calculated inclusively (start and end dates are both counted)
5. Weekends are not excluded from leave calculations in this implementation

## Potential Improvements

1. **Database Integration**: Replace in-memory storage with a persistent database (PostgreSQL)
2. **User Authentication**: Add role-based access control (employee vs HR)
3. **Email Notifications**: Send email notifications for leave requests and status changes
4. **Reporting**: Add reporting features for leave analytics
5. **Calendar Integration**: Integrate with calendar systems
6. **Advanced Leave Calculations**: Exclude weekends and holidays from leave calculations
7. **File Uploads**: Allow employees to upload supporting documents for leave requests
8. **Mobile Responsiveness**: Further optimize for mobile devices
9. **Internationalization**: Support multiple languages
10. **Audit Trail**: Track all changes to leave requests for compliance

## Deployment

### Deploy to Vercel

The application can be deployed to Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm install -g vercel`
3. Navigate to the project directory: `cd leave-management-system`
4. Deploy the application: `vercel --prod`

### Environment Variables

No environment variables are required for this application as it uses in-memory storage.

## Live Demo

A live demo of the application is available at: [https://github.com/SumitKumar-17/Symplora-Assignment](https://github.com/SumitKumar-17/Symplora-Assignment)


## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.