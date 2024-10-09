import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    hobbies: [],
    role: 'employee',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        hobbies: checked
          ? [...prevData.hobbies, value]
          : prevData.hobbies.filter((hobby) => hobby !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Password must be 8-20 characters long and can include letters, numbers, and special characters
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(formData.email)) {
      toast.error('Invalid email format.');
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      toast.error('Password must be 8-20 characters and include letters and numbers.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/auth/signup', formData);
      if (response.data.status) {
        toast.success('Signup successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Signup failed.');
      }
    } catch (error) {
      toast.error('Error signing up. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="firstName"
            id="firstName"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <label
            htmlFor="firstName"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First Name
          </label>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="lastName"
            id="lastName"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <label
            htmlFor="lastName"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last Name
          </label>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <select
            name="gender"
            id="gender"
            className="block py-2.5  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <label
            htmlFor="gender"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Gender
          </label>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <div className="flex items-center space-x-4">
            <label className="block text-sm text-gray-500">Hobbies :</label>
            <div className="flex space-x-4">
              <div>
                <input
                  type="checkbox"
                  id="reading"
                  name="hobbies"
                  value="Reading"
                  checked={formData.hobbies.includes('Reading')}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="reading" className="text-sm text-gray-500">Reading</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="travelling"
                  name="hobbies"
                  value="Travelling"
                  checked={formData.hobbies.includes('Travelling')}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="travelling" className="text-sm text-gray-500">Travelling</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="sports"
                  name="hobbies"
                  value="Sports"
                  checked={formData.hobbies.includes('Sports')}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="sports" className="text-sm text-gray-500">Sports</label>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
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
            value={formData.password}
            onChange={handleInputChange}
            minLength="8"
            maxLength="20"
            required
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <p>Have an account?</p>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => navigate('/login')}
          >
            Login Here
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
