"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State for error messages

  const validate = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const formData = {
    username,
    email,
    password,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return; // Prevent submission if there are errors

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Error creating user:", await response.json());
        // Display user-friendly error message (optional)
        return;
      }

      const data = await response.json();
      console.log(data.message); // Success message
      alert("Account Created Successfully");

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating user");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-lg shadow-lg shadow-gray-200 ${
          window.innerWidth > 768 ? "w-1/3" : "w-full"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        {errors.username && <p className="text-red-500">{errors.username}</p>}
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
        </div>
        {errors.email && <p className="text-red-500">{errors.email}</p>}
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
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <div className="flex justify-end">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
