"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // State for error messages

  const validate = () => {
    const newErrors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return; // Prevent submission if there are errors

    const formData = {
      email,
      password,
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle failed login (e.g., invalid credentials)
        const data = await response.json();
        setErrors({ message: data.message }); // Set error message from response
        alert(data.message); // Display error message as an alert
        return;
      }

      const data = await response.json();
      console.log(data.message); // Success message

      // Show alert for login success
      alert('Login successful');

      // Redirect to '/tasks' after login success
      window.location.href = '/tasks';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className={`bg-white p-8 rounded-lg shadow-lg shadow-gray-200 ${
          window.innerWidth > 768 ? 'w-1/3' : 'w-full'
        }`}
      >
        <h1 className="text-2xl font-semibold mb-4">Log In</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;