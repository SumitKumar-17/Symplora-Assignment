import { 
  Employee, 
  CreateEmployeeRequest, 
  LeaveRequest, 
  CreateLeaveRequest, 
  UpdateLeaveRequest, 
  LeaveBalance,
  LeaveType
} from '@/types';
import * as fs from 'fs';
import * as path from 'path';

function loadDataFromFile<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
  }
  return [];
}

const employees: Employee[] = loadDataFromFile<Employee>('employees.json');
const leaveRequests: LeaveRequest[] = loadDataFromFile<LeaveRequest>('leaveRequests.json');
const leaveBalances: LeaveBalance[] = loadDataFromFile<LeaveBalance>('leaveBalances.json');

const leaveTypes: LeaveType[] = [
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

let nextEmployeeId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
let nextLeaveRequestId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 1;
let nextBalanceId = leaveBalances.length > 0 ? Math.max(...leaveBalances.map(b => b.id)) + 1 : 1;

export class EmployeeService {
  static getAllEmployees(): Employee[] {
    return employees;
  }

  static getEmployeeById(id: number): Employee | undefined {
    return employees.find(emp => emp.id === id);
  }

  static createEmployee(data: CreateEmployeeRequest): { success: boolean; data?: Employee; error?: string } {
    if (!data.name || !data.email || !data.department || !data.joiningDate) {
      return { success: false, error: 'All fields are required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (employees.some(emp => emp.email === data.email)) {
      return { success: false, error: 'Employee with this email already exists' };
    }

    const joiningDate = new Date(data.joiningDate);
    if (isNaN(joiningDate.getTime())) {
      return { success: false, error: 'Invalid joining date' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (joiningDate > today) {
      return { success: false, error: 'Joining date cannot be in the future' };
    }

    const newEmployee: Employee = {
      id: nextEmployeeId++,
      name: data.name,
      email: data.email,
      department: data.department,
      joiningDate: data.joiningDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    
    leaveTypes.forEach(leaveType => {
      const balance: LeaveBalance = {
        id: nextBalanceId++,
        employeeId: newEmployee.id,
        leaveTypeId: leaveType.id,
        balance: leaveType.daysAllowed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      leaveBalances.push(balance);
    });
    
    return { success: true, data: newEmployee };
  }

  static employeeExists(id: number): boolean {
    return employees.some(emp => emp.id === id);
  }
}

export class LeaveTypeService {
  static getAllLeaveTypes(): LeaveType[] {
    return leaveTypes;
  }

  static getLeaveTypeById(id: number): LeaveType | undefined {
    return leaveTypes.find(type => type.id === id);
  }
}

export class LeaveService {
  static getAllLeaveRequests(): LeaveRequest[] {
    return leaveRequests;
  }

  static getLeaveRequestsByEmployeeId(employeeId: number): LeaveRequest[] {
    return leaveRequests.filter(req => req.employeeId === employeeId);
  }

  static getLeaveRequestById(id: number): LeaveRequest | undefined {
    return leaveRequests.find(req => req.id === id);
  }

  static createLeaveRequest(data: CreateLeaveRequest): { success: boolean; data?: LeaveRequest; error?: string } {
    if (!EmployeeService.employeeExists(data.employeeId)) {
      return { success: false, error: 'Employee not found' };
    }

    const leaveType = LeaveTypeService.getLeaveTypeById(data.leaveTypeId);
    if (!leaveType) {
      return { success: false, error: 'Invalid leave type' };
    }

    if (!data.startDate || !data.endDate || !data.reason) {
      return { success: false, error: 'All fields are required' };
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { success: false, error: 'Invalid dates' };
    }
    
    if (endDate < startDate) {
      return { success: false, error: 'End date cannot be before start date' };
    }

    const employee = EmployeeService.getEmployeeById(data.employeeId);
    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }
    
    const joiningDate = new Date(employee.joiningDate);
    if (startDate < joiningDate) {
      return { success: false, error: 'Cannot apply for leave before joining date' };
    }

    const leaveDays = this.calculateLeaveDays(startDate, endDate);
    
    if (leaveDays <= 0) {
      return { success: false, error: 'Leave request must be for at least one day' };
    }

    const balance = this.getLeaveBalance(data.employeeId, data.leaveTypeId);
    if (!balance) {
      return { success: false, error: 'Leave balance not found' };
    }
    
    if (leaveDays > balance.balance) {
      return { success: false, error: `Insufficient leave balance. Available: ${balance.balance} days, Requested: ${leaveDays} days` };
    }

    const hasOverlap = this.hasOverlappingLeaveRequests(
      data.employeeId,
      startDate,
      endDate
    );
    
    if (hasOverlap) {
      return { success: false, error: 'Overlapping leave request exists' };
    }

    const newLeaveRequest: LeaveRequest = {
      id: nextLeaveRequestId++,
      employeeId: data.employeeId,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    leaveRequests.push(newLeaveRequest);
    
    return { success: true, data: newLeaveRequest };
  }

  static updateLeaveRequest(
    id: number,
    data: UpdateLeaveRequest
  ): { success: boolean; data?: LeaveRequest; error?: string } {
    const leaveRequest = this.getLeaveRequestById(id);
    
    if (!leaveRequest) {
      return { success: false, error: 'Leave request not found' };
    }
    
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)) {
      return { success: false, error: 'Invalid status' };
    }
    
    if (leaveRequest.status !== 'PENDING' && data.status === 'PENDING') {
      return { success: false, error: 'Cannot change status back to pending' };
    }
    
    if (leaveRequest.status === data.status) {
      return { success: true, data: leaveRequest };
    }
    
    if (data.status === 'APPROVED' && leaveRequest.status !== 'APPROVED') {
      const leaveDays = this.calculateLeaveDays(
        new Date(leaveRequest.startDate),
        new Date(leaveRequest.endDate)
      );
      
      const balance = this.getLeaveBalance(
        leaveRequest.employeeId,
        leaveRequest.leaveTypeId
      );
      
      if (balance && balance.balance >= leaveDays) {
        balance.balance -= leaveDays;
        balance.updatedAt = new Date().toISOString();
      } else {
        return { success: false, error: 'Insufficient leave balance' };
      }
    }
    
    if (leaveRequest.status === 'APPROVED' && data.status === 'REJECTED') {
      const leaveDays = this.calculateLeaveDays(
        new Date(leaveRequest.startDate),
        new Date(leaveRequest.endDate)
      );
      
      const balance = this.getLeaveBalance(
        leaveRequest.employeeId,
        leaveRequest.leaveTypeId
      );
      
      if (balance) {
        balance.balance += leaveDays;
        balance.updatedAt = new Date().toISOString();
      }
    }
    
    leaveRequest.status = data.status;
    leaveRequest.updatedAt = new Date().toISOString();
    
    return { success: true, data: leaveRequest };
  }

  static getLeaveBalance(employeeId: number, leaveTypeId: number): LeaveBalance | undefined {
    return leaveBalances.find(
      balance => 
        balance.employeeId === employeeId && 
        balance.leaveTypeId === leaveTypeId
    );
  }

  static getLeaveBalancesByEmployeeId(employeeId: number): LeaveBalance[] {
    return leaveBalances.filter(balance => balance.employeeId === employeeId);
  }

  private static calculateLeaveDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; 
    return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) + 1;
  }

  private static hasOverlappingLeaveRequests(
    employeeId: number,
    startDate: Date,
    endDate: Date
  ): boolean {
    return leaveRequests.some(request => {
      if (request.employeeId !== employeeId || request.status === 'REJECTED') {
        return false;
      }
      
      const requestStartDate = new Date(request.startDate);
      const requestEndDate = new Date(request.endDate);
      
      return (
        (startDate >= requestStartDate && startDate <= requestEndDate) ||
        (endDate >= requestStartDate && endDate <= requestEndDate) ||
        (startDate <= requestStartDate && endDate >= requestEndDate)
      );
    });
  }
}