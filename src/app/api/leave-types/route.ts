import { NextResponse } from 'next/server';
import { LeaveTypeService } from '@/lib/services';
import { ApiResponse, LeaveType } from '@/types';

export async function GET() {
  try {
    const leaveTypes = LeaveTypeService.getAllLeaveTypes();
    const response: ApiResponse<LeaveType[]> = {
      success: true,
      data: leaveTypes
    };
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<LeaveType[]> = {
      success: false,
      error: 'Failed to fetch leave types'
    };
    return NextResponse.json(response, { status: 500 });
  }
}