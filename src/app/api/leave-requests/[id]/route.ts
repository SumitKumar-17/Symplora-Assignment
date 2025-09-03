import { NextResponse } from 'next/server';
import { LeaveService } from '@/lib/services';
import { 
  UpdateLeaveRequest,
  ApiResponse,
  LeaveRequest
} from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id);
    const data: UpdateLeaveRequest = await request.json();
    
    if (!data.status || !['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)) {
      const response: ApiResponse<LeaveRequest> = {
        success: false,
        error: 'Invalid status'
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const result = LeaveService.updateLeaveRequest(requestId, data);
    
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
    return NextResponse.json(response);
  } catch {
    const response: ApiResponse<LeaveRequest> = {
      success: false,
      error: 'Failed to update leave request'
    };
    return NextResponse.json(response, { status: 500 });
  }
}