"use client";
import { useState, useEffect } from 'react';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Spacer } from '@nextui-org/react';
import TopBar from '@/components/topbar';
import Link from 'next/link';
import User from '@/components/input';
import { useUser } from '@clerk/clerk-react';


const Task = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [comments, setComments] = useState({});
  const [filterOption, setFilterOption] = useState('all');
  const [file, setFiles] = useState(null);
  const [commentsCleared, setCommentsCleared] = useState(() => {
    const storedCommentsCleared = window.localStorage.getItem('commentsCleared');
    return storedCommentsCleared ? JSON.parse(storedCommentsCleared) : false;
  });
  const [checkedItems, setCheckedItems] = useState(() => {
    const storedCheckedItems = window.localStorage.getItem('checkedItems');
    return storedCheckedItems ? JSON.parse(storedCheckedItems) : {};
  });

  const user = useUser();
  // const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserDetails, setshowUserDetails] = useState(() => {
    const storedshowUserDetails = window.localStorage.getItem('showUserDetails');
    return storedshowUserDetails ? JSON.parse(storedshowUserDetails) : false;
  });
 
  useEffect(() => {
    window.localStorage.setItem('showUserDetails', JSON.stringify(showUserDetails));
  }, [showUserDetails]);


  useEffect(() => {
    window.localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    let url = '/api/checklist';
    if (filterOption === 'daily') {
      url += '?filter=daily';
    } else if (filterOption === 'weekly') {
      url += '?filter=weekly';
    } else if (filterOption === 'monthly') {
      url += '?filter=monthly';
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, [filterOption]);

  const handleEditItem = (id, newComment) => {
    // Update a checklist item's comment through the API
    fetch(`/api/checklist?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: newComment }),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch updated checklist items after editing
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setComments(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };
  const handleCommentChange = (id, newComment) => {
    setComments({ ...comments, [id]: newComment });
  };

  const handleClearComments = (filter) => {
    fetch(`/api/checklist/?filter=${filter}`, {
      method: 'PATCH',
    })
      .then((response) => response.json())
      .then((data) => {
        setCommentsCleared(true);
        setCheckedItems({}); // Clear checked items when comments are cleared
        setshowUserDetails(false); // Clear user details
        setFiles({}); 
        fetch(`/api/checklist?filter=${filterOption}`)
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4 bg-white pt-8 mt-10 border border-green-600 rounded">
        <h1 className='text-extrabold text-3xl text-green-700 text-center mb-8'>SYSTEMS ADMINISTRATOR CHECKLIST</h1>
        <Link href="/dashboard">
          <div className="flex items-end justify-end">
            <HiOutlinePencilSquare className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer" />
          </div>
        </Link>
        <div className='mb-4 text-green-700'>
          <label htmlFor="filter">Filter by :</label>
          <select
            id="filter"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className='ml-2 bg-gray-200'
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            className="ml-2 bg-green-500 text-white px-4 py-1 rounded"
            onClick={() => handleClearComments(filterOption)}
          >
            Clear Comments
          </button>
        </div>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={`container border-black rounded-lg shadow-lg p-6 h-38 items-center mb-4 ${
                checkedItems[item.id] ? 'bg-green-300' : (commentsCleared ? 'bg-pink-200' : 'bg-pink-200')
              }`}
            >
              <div className='flex items-center text-extrabold'>
                <span className="ml-2 mb-2 font-bold">{item.item}</span>
              </div>
              <span className="ml-2 mb-2 font-light" onChange={handleCommentChange}>{item.comment}</span>
              {file ? (
                <div>
                  File: {file.name} {/* Display the name of the selected file */}
                </div>
              ) : (
                <div>
                  <label htmlFor="file" className="block mb-2">
                  </label>
                  <input
                    type="file"
                    id={`file-${item.id}`}
                    onChange={(e) => setFiles({ ...file, [item.id]: e.target.files[0] })}
                    className="mb-4"
                  />
                  {/* <User/> */}
                </div>
              )}
              <div className="flex items-end justify-end">
                <div className="flex items-center justify-center">
                <button
                className={`bg-green-500 text-white w-full h-8 sm:w-40 rounded-2xl font-semibold text-sm`}
                onClick={() => {
                  const newComment = prompt('Add a comment:');
                  if (newComment) {
                    handleEditItem(item.id, newComment);
                    setCheckedItems({ ...checkedItems, [item.id]: true }); // Set the checked state to true
                    console.log(`User:`, user); // Log the user object for debugging
                    console.log(`User ${user.user.fullName} clicked the button at ${user.user.updatedAt}`);
                    setshowUserDetails({ [item.id]: true }); // Set state to show user details
                  }
                }}
              >
                Mark as Done
              </button>
            </div>
            <Spacer />
          </div>
          {/* Conditionally render user details */}
          {showUserDetails[item.id] && user.user && (
            <div>
              <p>Changed by: {user.user.fullName}</p>
            </div>
          )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Task;

