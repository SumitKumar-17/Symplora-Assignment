'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Employee, LeaveRequest } from '@/types';

export default function LeaveManagement() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await fetch('/api/employees');
        const employeesData = await employeesRes.json();
        
        const leaveRequestsRes = await fetch('/api/leave-requests');
        const leaveRequestsData = await leaveRequestsRes.json();
        
        if (employeesData.success) {
          setEmployees(employeesData.data);
        }
        
        if (leaveRequestsData.success) {
          setLeaveRequests(leaveRequestsData.data);
        }
      } catch {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEmployeeName = (id: number) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unknown';
  };

  const handleLeaveAction = async (requestId: number, action: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/leave-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLeaveRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: action } : req
          )
        );
        
        toast.success(`Leave request ${action.toLowerCase()} successfully!`);
      } else {
        toast.error(`Failed to ${action.toLowerCase()} leave request: ${data.error}`);
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="mt-2 text-gray-600">Approve or reject employee leave requests</p>
          </div>
          <button
            onClick={() => router.push('/leave/request')}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
          >
            New Leave Request
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getEmployeeName(request.employeeId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {request.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'REJECTED' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'PENDING' ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleLeaveAction(request.id, 'APPROVED')}
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleLeaveAction(request.id, 'REJECTED')}
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No leave requests</h3>
                        <p className="mt-1 text-gray-500">There are currently no leave requests to manage.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}