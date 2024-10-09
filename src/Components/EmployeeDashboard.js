import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state to handle data fetching status

  const navigate = useNavigate();

  useEffect(() => {
    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      // Fetch department data
      axios.get(`http://localhost:4000/api/department/getdata?employeeId=${employeeId}`)
        .then(response => {
          if (response.data && response.data.data && response.data.data.length > 0) {
            setDepartments(response.data.data); // Set department data
          } else {
            console.log('No department data found for the logged-in employee');
          }
        })
        .catch(error => console.error('Error fetching department data:', error));

      // Fetch all employees data
      axios.get('http://localhost:4000/api/user/getdata')
        .then(response => setEmployees(response.data))
        .catch(error => console.error('Error fetching employee data:', error))
        .finally(() => setLoading(false)); // Set loading false after both API calls are finished

    } else {
      navigate('/login'); // Redirect to login if employeeId is not found in localStorage
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  // Find employee full name from the employees array
  const getEmployeeFullName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
  };

  // Filter departments where employeeId matches the logged-in employee
  const employeeId = localStorage.getItem('employeeId');
  const filteredDepartments = departments.filter(dept => dept.employeeId === employeeId);

  return (
    <div className="p-8">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : filteredDepartments.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2">Your Departments</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Employee ID</th>
                <th className="px-4 py-2 border">Department Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Salary</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dept => {
                const employeeFullName = getEmployeeFullName(dept.employeeId);

                return (
                  <tr key={dept._id}>
                    <td className="px-4 py-2 border">{employeeFullName}</td>
                    <td className="px-4 py-2 border">{dept.employeeId}</td>
                    <td className="px-4 py-2 border">{dept.name}</td>
                    <td className="px-4 py-2 border">{dept.category}</td>
                    <td className="px-4 py-2 border">{dept.location}</td>
                    <td className="px-4 py-2 border">{dept.salary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No department information available...</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;
