import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Leave Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive solution for managing employee leaves, tracking balances, and streamlining HR processes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <Link href="/dashboard" className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h3>
            <p className="text-gray-600">View employee information and leave balances</p>
          </Link>
          
          <Link href="/employees/add" className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Add Employee</h3>
            <p className="text-gray-600">Register new employees in the system</p>
          </Link>
          
          <Link href="/leave/request" className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Request Leave</h3>
            <p className="text-gray-600">Submit a new leave request</p>
          </Link>
          
          <Link href="/leave/manage" className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Leaves</h3>
            <p className="text-gray-600">Approve or reject leave requests</p>
          </Link>
        </div>
        
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This System</h2>
            <div className="flex justify-center mb-8">
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              This Leave Management System is designed to help HR teams efficiently manage employee leave requests. 
              The system allows for easy tracking of leave balances, submission of leave requests, and approval workflows.
            </p>
            <p className="text-gray-600 text-lg">
              Built with Next.js, TypeScript, and Tailwind CSS, this application provides a modern, responsive interface 
              that works seamlessly across all devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}