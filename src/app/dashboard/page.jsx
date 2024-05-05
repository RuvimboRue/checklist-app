"use client";
import { useState, useEffect } from 'react';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import TopBar from '@/components/topbar';
import { TiTick } from "react-icons/ti";
import Link from 'next/link';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    fetch('/api/checklist')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  const handleNewItemChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleAddItem = () => {
    fetch('/api/checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem, filter: filterOption }),
    })
      .then((response) => response.json())
      .then(() => {
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  const handleEditItem = (id, newItem) => {
    fetch(`/api/form?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem }),
    })
      .then((response) => response.json())
      .then(() => {
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (id) => {
    fetch(`/api/checklist/?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        alert('Deleted Successfully');
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

  // Generate JSX elements using for loop
  const itemsJSX = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    itemsJSX.push(
      <li key={item.id} className="container boarder-black bg-gray-300 rounded-lg shadow-lg p-6 h-28 items-center mb-4">
        <div className='flex items-center'>
          <span className="ml-2 mb-2 text-bold">{item.item}</span>
        </div>
        <div className="flex items-end justify-end">
          <HiOutlinePencilSquare
            className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer"
            onClick={() => {
              const newItem = prompt('Edit task name');
              if (newItem) {
                handleEditItem(item.id, newItem);
              }
            }}
          />
          <RiDeleteBin6Line
            className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer ml-2"
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                handleDeleteItem(item.id);
              }
            }}
          />
        </div>
      </li>
    );
  }

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4 bg-gray-200 pt-8 mt-10 border border-gray-600 rounded">
        <h1 className='text-extrabold text-3xl text-center mb-8'>EDIT CHECKLIST</h1>
        <Link href="/tasks">
          <div className="flex items-end justify-end">
            <TiTick
              className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer"
            />
          </div>
        </Link>
        <ul>
          {itemsJSX}
        </ul>
        <div className='flex items-center'>
          <input className='w-full h-10 sm:w-80' type="text" value={newItem} onChange={handleNewItemChange} />
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={filterOption === "daily"}
            onChange={() => setFilterOption("daily")}
            className="form-checkbox h-5 w-5 text-green-500 mr-2"
          />
          <span className="mr-4">Daily</span>

          <input
            type="checkbox"
            checked={filterOption === "weekly"}
            onChange={() => setFilterOption("weekly")}
            className="form-checkbox h-5 w-5 text-green-500 mr-2"
          />
          <span className="mr-4">Weekly</span>

          <input
            type="checkbox"
            checked={filterOption === "monthly"}
            onChange={() => setFilterOption("monthly")}
            className="form-checkbox h-5 w-5 text-green-500"
          />
          <span>Monthly</span>
        </div>
        <button className="bg-gray-500 text-white w-full h-10 sm:w-40 rounded-2xl font-semibold mt-4 text-lg ml-2" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
    </>
  );
};

export default Dashboard;
