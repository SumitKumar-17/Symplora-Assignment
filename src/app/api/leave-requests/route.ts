import { NextResponse } from 'next/server';
import { LeaveService } from '@/lib/services';
import { 
  CreateLeaveRequest,
  ApiResponse,
  LeaveRequest
} from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    
    let leaveRequests;
    if (employeeId) {
      leaveRequests = LeaveService.getLeaveRequestsByEmployeeId(parseInt(employeeId));
    } else {
      leaveRequests = LeaveService.getAllLeaveRequests();
    }
    
    const response: ApiResponse<LeaveRequest[]> = {
      success: true,
      data: leaveRequests
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<LeaveRequest[]> = {
      success: false,
      error: 'Failed to fetch leave requests'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateLeaveRequest = await request.json();
    
    const result = LeaveService.createLeaveRequest(data);
    
    if (!result.success) {
      const response: ApiResponse<LeaveRequest> = {
        success: false,
        error: result.error
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const response: ApiResponse<LeaveRequest> = {
      success: true,
      data: result.data
    };
    return NextResponse.json(response, { status: 201 });
  } catch {
    const response: ApiResponse<LeaveRequest> = {
      success: false,
      error: 'Failed to create leave request'
    };
    return NextResponse.json(response, { status: 500 });
  }
}