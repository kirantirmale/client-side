import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email: loginData.email,
                password: loginData.password,
            });
    
            if (response.data?.token && response.data?.role && response.data?.employeeId) {
                const { token, role, employeeId } = response.data;
    
                localStorage.setItem('token', token);
                localStorage.setItem('employeeId', employeeId);  
    
                if (role === "employee") {
                    toast.success('Login successful!');
                    setTimeout(() => {
                        navigate('/employee-dashboard');
                    }, 2000);
    
                } else if (role === "manager") {
                    toast.success('Login successful!');
                    setTimeout(() => {
                        navigate('/manager-dashboard');
                    }, 2000);
                } else {
                    console.error("Unexpected role:", role);
                    toast.error("Unexpected role. Please contact support.");
                }
            } else {
                toast.error("Login failed. Invalid credentials or server error.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Error during login. Please try again.");
        }
    };
    
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={loginData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <label
                        htmlFor="email"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Email
                    </label>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={loginData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <label
                        htmlFor="password"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Password
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Login
                </button>

                <div className="mt-4 text-center">
                    <p>Don't have an account?</p>
                    <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => navigate('/')}
                    >
                        Sign Up Here
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
