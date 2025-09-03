import { generateMockEmployees, generateMockLeaveRequests, generateMockLeaveBalances, leaveTypes } from './mockData';
import * as fs from 'fs';
import * as path from 'path';

const employees = generateMockEmployees(50);
const leaveRequests = generateMockLeaveRequests(employees, leaveTypes);
const leaveBalances = generateMockLeaveBalances(employees, leaveTypes);

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(path.join(dataDir, 'employees.json'), JSON.stringify(employees, null, 2));
fs.writeFileSync(path.join(dataDir, 'leaveRequests.json'), JSON.stringify(leaveRequests, null, 2));
fs.writeFileSync(path.join(dataDir, 'leaveBalances.json'), JSON.stringify(leaveBalances, null, 2));
fs.writeFileSync(path.join(dataDir, 'leaveTypes.json'), JSON.stringify(leaveTypes, null, 2));

console.log('Mock data has been generated and saved to the data directory.');
console.log(`Total employees: ${employees.length}`);
console.log(`Total leave requests: ${leaveRequests.length}`);
console.log(`Total leave balances: ${leaveBalances.length}`);
console.log(`Total leave types: ${leaveTypes.length}`);