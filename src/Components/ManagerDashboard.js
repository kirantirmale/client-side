import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaRedoAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const ManagerDashboard = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({});
    const [employees, setEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editDeptId, setEditDeptId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:4000/api/department/getdata?page=${currentPage}&limit=5`)
            .then(response => {
                setDepartments(response.data.data);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error(error));

        axios.get('http://localhost:4000/api/user/getdata')
            .then(response => setEmployees(response.data))
            .catch(error => console.error(error));
    }, [currentPage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment({ ...newDepartment, [name]: value });
    };

    const handleAddOrUpdateDepartment = () => {
        if (editMode) {
            axios.post(`http://localhost:4000/api/department/updatedata?id=${editDeptId}`, newDepartment)
                .then(response => {
                    toast.success('Department updated successfully');
                    axios.get(`http://localhost:4000/api/department/getdata?page=${currentPage}&limit=5`)
                        .then(res => {
                            setDepartments(res.data.data);
                            setTotalPages(res.data.totalPages);
                        })
                        .catch(err => console.error(err));
                    setEditMode(false);
                    setEditDeptId(null);
                    setNewDepartment({});
                })
                .catch(error => {
                    console.error('Error updating department:', error);
                    toast.error('Failed to update department');
                });
        } else {
            axios.post('http://localhost:4000/api/department/adddata', newDepartment)
                .then(response => {
                    toast.success('Department added successfully');
                    axios.get(`http://localhost:4000/api/department/getdata?page=${currentPage}&limit=5`)
                        .then(res => {
                            setDepartments(res.data.data);
                            setTotalPages(res.data.totalPages);
                        })
                        .catch(err => console.error(err));
                    setNewDepartment({});
                })
                .catch(error => {
                    console.error('Error adding department:', error);
                    toast.error('Failed to add department');
                });
        }
    };


    const handleEdit = (dept) => {
        setEditMode(true);
        setEditDeptId(dept._id);
        setNewDepartment({
            employeeId: dept.employeeId ? dept.employeeId : '',
            name: dept.name,
            category: dept.category,
            location: dept.location,
            salary: dept.salary,
        });
    };

    const handleDelete = (deptId) => {
        axios.delete(`http://localhost:4000/api/department/deletedata?id=${deptId}`)
            .then(() => {
                setDepartments(departments.filter(dept => dept._id !== deptId));
            })
            .catch(error => console.error(error));
    };

    const handleReset = () => {
        setNewDepartment({});
        setEditMode(false);
        setEditDeptId(null);
    };

    const handleLogout = () => {
        toast.info("Logging out in Succesful...");

        setTimeout(() => {
            localStorage.removeItem('token');
            navigate('/login');
        }, 2000);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="p-8 w-full ">
            <div className="flex justify-between w-full ">
                <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4">Logout</button>
                <ToastContainer />
            </div>

            <div className="mb-8 p-6 bg-white shadow rounded-lg w-2/3 m-auto">
                <h2 className="text-2xl font-semibold mb-4">{editMode ? 'Edit Department' : 'Add New Department'}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select name="employeeId" className="px-4 py-2 border border-gray-300 rounded" value={newDepartment.employeeId || ''} onChange={handleInputChange}>
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                            <option key={employee._id} value={employee._id}>
                                {employee.firstName} {employee.lastName} ({employee._id})
                            </option>
                        ))}
                    </select>
                    <input name="name" placeholder="Department Name" className="px-4 py-2 border border-gray-300 rounded" value={newDepartment.name || ''} onChange={handleInputChange} />
                    <input name="category" placeholder="Category" className="px-4 py-2 border border-gray-300 rounded" value={newDepartment.category || ''} onChange={handleInputChange} />
                    <input name="location" placeholder="Location" className="px-4 py-2 border border-gray-300 rounded" value={newDepartment.location || ''} onChange={handleInputChange} />
                    <input name="salary" placeholder="Salary" className="px-4 py-2 border border-gray-300 rounded" value={newDepartment.salary || ''} onChange={handleInputChange} />
                    <div className="flex space-x-4">
                        <button onClick={handleAddOrUpdateDepartment} className={`${editMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded`}>
                            {editMode ? 'Update Department' : 'Add Department'}
                        </button>
                        <button onClick={handleReset} className="flex items-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                            <FaRedoAlt className="mr-2" /> Reset
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Departments</h2>
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Full Name</th>
                        <th className="px-4 py-2 border">Employee ID</th>
                        <th className="px-4 py-2 border">Department Name</th>
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Location</th>
                        <th className="px-4 py-2 border">Salary</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map(dept => {
                        const employee = employees.find(emp => emp._id === dept.employeeId);
                        const employeeFullName = employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';  

                        return (
                            <tr key={dept._id}>
                                <td className="px-4 py-2 border">{employeeFullName}</td> 
                                <td className="px-4 py-2 border">{dept.employeeId}</td>
                                <td className="px-4 py-2 border">{dept.name}</td>
                                <td className="px-4 py-2 border">{dept.category}</td>
                                <td className="px-4 py-2 border">{dept.location}</td>
                                <td className="px-4 py-2 border">{dept.salary}</td>
                                <td className="px-4 py-2 border">
                                    <button onClick={() => handleEdit(dept)} className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600">Edit</button>
                                    <button onClick={() => handleDelete(dept._id)} className="bg-red-500 text-white py-1 px-2 ml-2 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            <div className="flex justify-center space-x-4 mt-4">
                <button onClick={handlePreviousPage} className={`py-2 px-4 bg-blue-500 text-white rounded ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`} disabled={currentPage === 1}>
                    <SlArrowLeft />

                </button>
                <span className="py-2 px-4 bg-gray-100 rounded">Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} className={`py-2 px-4 bg-blue-500 text-white rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`} disabled={currentPage === totalPages}>
                    <SlArrowRight />
                </button>
            </div>
        </div>
    );
};

export default ManagerDashboard;
