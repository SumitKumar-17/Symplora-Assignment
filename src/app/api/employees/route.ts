import { NextResponse } from 'next/server';
import { EmployeeService } from '@/lib/services';
import { 
  CreateEmployeeRequest,
  ApiResponse,
  Employee
} from '@/types';

export async function GET() {
  try {
    const employees = EmployeeService.getAllEmployees();
    const response: ApiResponse<Employee[]> = {
      success: true,
      data: employees
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<Employee[]> = {
      success: false,
      error: 'Failed to fetch employees'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateEmployeeRequest = await request.json();
    
    const result = EmployeeService.createEmployee(data);
    
    if (!result.success) {
      const response: ApiResponse<Employee> = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const response: ApiResponse<Employee> = {
      success: true,
      data: result.data
    };
    return NextResponse.json(response, { status: 201 });
  } catch {
    const response: ApiResponse<Employee> = {
      success: false,
      error: 'Failed to create employee'
    };
    return NextResponse.json(response, { status: 500 });
  }
}