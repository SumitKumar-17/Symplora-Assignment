'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LeaveType, Employee } from '@/types';

export default function LeaveRequestPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await fetch('/api/employees');
        const employeesData = await employeesRes.json();
        
        const leaveTypesRes = await fetch('/api/leave-types');
        const leaveTypesData = await leaveTypesRes.json();
        
        if (employeesData.success) {
          setEmployees(employeesData.data);
        }
        
        if (leaveTypesData.success) {
          setLeaveTypes(leaveTypesData.data);
        }
      } catch {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    
    if (!formData.leaveTypeId) {
      newErrors.leaveTypeId = 'Leave type is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          employeeId: parseInt(formData.employeeId),
          leaveTypeId: parseInt(formData.leaveTypeId)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          employeeId: '',
          leaveTypeId: '',
          startDate: '',
          endDate: '',
          reason: ''
        });
        
        toast.success('Leave request submitted successfully!');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to submit leave request');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-white">Apply for Leave</h1>
            <p className="mt-2 text-indigo-100">Submit a new leave request</p>
          </div>
          
          <div className="px-6 py-8 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee *
                  </label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.employeeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.department})
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
                </div>
                
                <div>
                  <label htmlFor="leaveTypeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type *
                  </label>
                  <select
                    id="leaveTypeId"
                    name="leaveTypeId"
                    value={formData.leaveTypeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.leaveTypeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map(leaveType => (
                      <option key={leaveType.id} value={leaveType.id}>
                        {leaveType.name} ({leaveType.daysAllowed} days allowed)
                      </option>
                    ))}
                  </select>
                  {errors.leaveTypeId && <p className="mt-1 text-sm text-red-600">{errors.leaveTypeId}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Leave *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.reason ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please provide a reason for your leave request"
                  ></textarea>
                  {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}