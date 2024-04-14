"use client";
import { useState, useEffect } from 'react';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Spacer } from '@nextui-org/react';
import TopBar from '@/components/topbar';
import Link from 'next/link';

const Task = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  // const [checkedItems, setCheckedItems] = useState({});
  const [comments, setComments] = useState({});
  const [filterOption, setFilterOption] = useState('all');

  // useEffect(() => {
    // Fetch checklist items from the API
    // fetch('/api/checklist')
    //   .then((response) => response.json())
    //   .then((data) => setItems(data))
    //   .catch((error) => console.error(error));

    // Retrieve checked items from local storage
  //   const storedCheckedItems = localStorage.getItem('checkedItems');
  //   if (storedCheckedItems) {
  //     setCheckedItems(JSON.parse(storedCheckedItems));
  //   }
  // }, []);
 // useEffect(() => {
    // Fetch checklist items from the API
    // fetch('/api/checklist')
    //   .then((response) => response.json())
    //   .then((data) => setItems(data))
    //   .catch((error) => console.error(error));

    // Retrieve checked items from local storage
  //   const storedCheckedItems = window.localStorage.getItem('checkedItems');
  //   if (storedCheckedItems) {
  //     setCheckedItems(JSON.parse(storedCheckedItems));
  //   }
  // }, []);
  const [checkedItems, setCheckedItems] = useState(() => {
    // Retrieve checked items from local storage on initial render
    const storedCheckedItems = window.localStorage.getItem('checkedItems');
    return storedCheckedItems ? JSON.parse(storedCheckedItems) : {};
  });
  
  useEffect(() => {
    // Save checked items to local storage whenever it changes
    window.localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
  // Fetch checklist items from the API based on the filter option
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

  // Rest of the code...
}, [filterOption]);

  useEffect(() => {
    // Save checked items to local storage whenever it changes
    window.localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleNewItemChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleAddItem = () => {
    // Add a new checklist item through the API
    fetch('/api/checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem }),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch updated checklist items after adding
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

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

  const handleDeleteItem = (id) => {
    // Delete a checklist item through the API
    fetch(`/api/checklist/?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch updated checklist items after deleting
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  const handleCheckboxChange = (id) => {
    const isChecked = checkedItems[id];
    setCheckedItems({ ...checkedItems, [id]: !isChecked });

    fetch(`/api/form/status?id=${id}&status=${!isChecked}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        // Optionally fetch updated items here if needed
      })
      .catch((error) => console.error(error));
  };

  const handleCommentChange = (id, newComment) => {
    setComments({ ...comments, [id]: newComment });
  };

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4 bg-white pt-8 mt-10 border border-gray-600 rounded">
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
</div>
        <ul>
          {items.map((item) => (
           <li
           key={item.id}
           className={`container border-black rounded-lg shadow-lg p-6 h-38 items-center mb-4 ${
             checkedItems[item.id] ? 'bg-green-300' : 'bg-pink-200'
           }`}
         >
              <div className='flex items-center text-extrabold'>
                <span className="ml-2 mb-2 text-extrabold">{item.item}</span>
              </div>
              <span className="ml-2 mb-2 text-light" onChange={handleCommentChange}>{item.comment}</span>
              <div className="flex items-end justify-end">
                <div className="flex items-center justify-center">
                  <button
                    className={`bg-gray-500 text-white w-full h-8 sm:w-40 rounded-2xl font-semibold text-sm`}
                    onClick={() => {
                      const newComment = prompt('Add a comment:');
                      if (newComment) {
                        handleEditItem(item.id, newComment);
                        setCheckedItems({ ...checkedItems, [item.id]: true }); // Set the checked state to true
                      }
                    }}
                  >
                    Mark as Done
                  </button>
                </div>
                <Spacer />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Task;