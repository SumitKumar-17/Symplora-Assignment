import { NextResponse } from 'next/server';
import { LeaveService } from '@/lib/services';
import { ApiResponse, LeaveBalance } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    
    if (!employeeId) {
      const response: ApiResponse<LeaveBalance[]> = {
        success: false,
        error: 'Missing employeeId parameter'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const leaveBalances = LeaveService.getLeaveBalancesByEmployeeId(parseInt(employeeId));
    const response: ApiResponse<LeaveBalance[]> = {
      success: true,
      data: leaveBalances
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<LeaveBalance[]> = {
      success: false,
      error: 'Failed to fetch leave balances'
    };
    return NextResponse.json(response, { status: 500 });
  }
}