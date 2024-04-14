"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const TopBar = () => {
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch username on initial render 
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    setUsername(storedUsername || '');
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <Link href="/">
          <p className="text-white font-bold text-xl">IT OPERATIONS</p>
        </Link>
        <div className="relative">
          <button className="flex items-center" onClick={toggleDropdown}>
            <span className="mr-2 text-white">Welcome {username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 3a7 7 0 100 14 7 7 0 000-14zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <Link href="/dashboard">
                <p className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Edit Checklist
                </p>
              </Link>

              <hr className="my-2" />
              <Link href="/password">
                <p className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Change Password
                </p>
              </Link>
              <hr className="my-2" />
              <Link href="/login">
                <p className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Logout
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;