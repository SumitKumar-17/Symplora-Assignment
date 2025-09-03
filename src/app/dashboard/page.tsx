'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, LeaveRequest, LeaveType, LeaveBalance } from '@/types';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        const data = await res.json();
        if (data.success) {
          setEmployees(data.data);
        }
      } catch {
        toast.error('Failed to fetch employees');
      }
    };

    const fetchLeaveTypes = async () => {
      try {
        const res = await fetch('/api/leave-types');
        const data = await res.json();
        if (data.success) {
          setLeaveTypes(data.data);
        }
      } catch {
        toast.error('Failed to fetch leave types');
      }
    };

    Promise.all([fetchEmployees(), fetchLeaveTypes()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;

    const fetchLeaveData = async () => {
      try {
        const requestsRes = await fetch(`/api/leave-requests?employeeId=${selectedEmployee}`);
        const requestsData = await requestsRes.json();
        
        const balancesRes = await fetch(`/api/leave-balances?employeeId=${selectedEmployee}`);
        const balancesData = await balancesRes.json();
        
        if (requestsData.success) {
          setLeaveRequests(requestsData.data);
        }
        
        if (balancesData.success) {
          setLeaveBalances(balancesData.data);
        }
      } catch {
        toast.error('Failed to fetch leave data');
      }
    };

    fetchLeaveData();
  }, [selectedEmployee]);

  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployee(employeeId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLeaveTypeName = (id: number) => {
    const leaveType = leaveTypes.find(type => type.id === id);
    return leaveType ? leaveType.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Leave Management Dashboard</h1>
          <p className="mt-4 text-xl text-gray-600">Manage employee leaves and track balances</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Employees</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {employees.map(employee => (
                    <div 
                      key={employee.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedEmployee === employee.id 
                          ? 'bg-indigo-50 border-l-4 border-indigo-500 shadow-sm' 
                          : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                      onClick={() => handleEmployeeSelect(employee.id)}
                    >
                      <h3 className="font-medium text-gray-800">{employee.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{employee.email}</p>
                      <p className="text-sm text-gray-600">{employee.department}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Joined: {formatDate(employee.joiningDate)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {employees.length === 0 && (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No employees</h3>
                    <p className="mt-1 text-gray-500">Get started by adding a new employee.</p>
                    <button
                      onClick={() => router.push('/employees/add')}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Add Employee
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {selectedEmployee ? (
              <>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Leave Balances</h2>
                  </div>
                  <div className="p-6">
                    {leaveBalances.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {leaveBalances.map(balance => {
                          const leaveType = leaveTypes.find(type => type.id === balance.leaveTypeId);
                          return (
                            <div key={balance.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-gray-800">{leaveType?.name || 'Unknown'}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{leaveType?.description}</p>
                                </div>
                                <span className="text-3xl font-bold text-indigo-600">{balance.balance}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">days available</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No leave balances</h3>
                        <p className="mt-1 text-gray-500">This employee has no leave balances configured.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Leave Requests</h2>
                  </div>
                  <div className="p-6">
                    {leaveRequests.length > 0 ? (
                      <div className="space-y-4">
                        {leaveRequests.map(request => (
                          <div key={request.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-gray-800">
                                  {getLeaveTypeName(request.leaveTypeId)}
                                </h3>
                                <p className="text-gray-600 mt-1">{request.reason}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'APPROVED' 
                                  ? 'bg-green-100 text-green-800' 
                                  : request.status === 'REJECTED' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No leave requests</h3>
                        <p className="mt-1 text-gray-500">This employee has not submitted any leave requests.</p>
                        <button
                          onClick={() => router.push('/leave/request')}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Request Leave
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div className="p-12 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Select an Employee</h2>
                  <p className="mt-4 text-gray-600 max-w-md mx-auto">
                    Choose an employee from the list to view their leave information, balances, and requests.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={() => router.push('/employees/add')}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
                    >
                      Add Your First Employee
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}