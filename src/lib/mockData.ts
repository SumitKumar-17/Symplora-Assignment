import { Employee, LeaveRequest, LeaveBalance, LeaveType } from '@/types';

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra',
  'Donald', 'Donna', 'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
  'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah', 'Timothy', 'Dorothy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const departments = [
  'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 
  'Information Technology', 'Customer Service', 'Research and Development', 'Legal'
];

const reasons = [
  'Family vacation', 'Medical appointment', 'Personal matters', 'Rest and relaxation', 
  'Home maintenance', 'Family event', 'Travel', 'Health checkup', 'Mental health break',
  'Visiting relatives', 'Outdoor activities', 'Cultural event', 'Workshop attendance'
];

export function generateMockEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  const now = new Date().toISOString();
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const joinDate = new Date();
    joinDate.setFullYear(joinDate.getFullYear() - Math.floor(Math.random() * 5) - 1);
    joinDate.setDate(Math.floor(Math.random() * 30) + 1);
    joinDate.setMonth(Math.floor(Math.random() * 12));
    
    employees.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      joiningDate: joinDate.toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now
    });
  }
  
  return employees;
}

export function generateMockLeaveRequests(employees: Employee[], leaveTypes: LeaveType[]): LeaveRequest[] {
  const leaveRequests: LeaveRequest[] = [];
  let requestId = 1;
  
  employees.forEach(employee => {
    const requestCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < requestCount; i++) {
      const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      
      const joinDate = new Date(employee.joiningDate);
      const startDate = new Date(joinDate);
      startDate.setDate(joinDate.getDate() + Math.floor(Math.random() * 365));
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10) + 1);
      
      const statusOptions = ['APPROVED', 'APPROVED', 'APPROVED', 'APPROVED', 'APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'PENDING', 'REJECTED'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      const now = new Date().toISOString();
      
      leaveRequests.push({
        id: requestId++,
        employeeId: employee.id,
        leaveTypeId: leaveType.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: status as 'PENDING' | 'APPROVED' | 'REJECTED',
        createdAt: now,
        updatedAt: now
      });
    }
  });
  
  return leaveRequests;
}

export function generateMockLeaveBalances(employees: Employee[], leaveTypes: LeaveType[]): LeaveBalance[] {
  const leaveBalances: LeaveBalance[] = [];
  let balanceId = 1;
  
  employees.forEach(employee => {
    leaveTypes.forEach(leaveType => {
      const now = new Date().toISOString();
      
      const balance = Math.floor(Math.random() * (leaveType.daysAllowed + 1));
      
      leaveBalances.push({
        id: balanceId++,
        employeeId: employee.id,
        leaveTypeId: leaveType.id,
        balance: balance,
        createdAt: now,
        updatedAt: now
      });
    });
  });
  
  return leaveBalances;
}

export const leaveTypes: LeaveType[] = [
  {
    id: 1,
    name: 'Annual',
    description: 'Annual leave',
    daysAllowed: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Sick',
    description: 'Sick leave',
    daysAllowed: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Maternity',
    description: 'Maternity leave',
    daysAllowed: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Paternity',
    description: 'Paternity leave',
    daysAllowed: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];