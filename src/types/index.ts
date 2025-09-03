export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  joiningDate: string; 
  createdAt: string; 
  updatedAt: string; 
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  department: string;
  joiningDate: string; 
}

export interface CreateEmployeeResponse {
  success: boolean;
  data?: Employee;
  error?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  daysAllowed: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string; 
  endDate: string; 
  reason: string;
  status: LeaveStatus;
  createdAt: string; 
  updatedAt: string; 
}

export interface CreateLeaveRequest {
  employeeId: number;
  leaveTypeId: number;
  startDate: string; 
  endDate: string; 
  reason: string;
}

export interface UpdateLeaveRequest {
  status: LeaveStatus;
}

export interface CreateLeaveResponse {
  success: boolean;
  data?: LeaveRequest;
  error?: string;
}

export interface UpdateLeaveResponse {
  success: boolean;
  data?: LeaveRequest;
  error?: string;
}

export interface LeaveBalance {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  balance: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface LeaveBalanceResponse {
  success: boolean;
  data?: LeaveBalance;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
