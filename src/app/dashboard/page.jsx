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
  const [checkedItems, setCheckedItems] = useState({}); // State to track checked checkboxes
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    // Fetch checklist items from the API
    fetch('/api/checklist')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

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
      body: JSON.stringify({ item: newItem, filter: filterOption }),
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

  const handleEditItem = (id, newItem) => {
    // Update a checklist item through the API
    fetch(`/api/form?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newItem }),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch updated checklist items after editing
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (id) => {

    //alert('Delete');

    // Delete a checklist item through the API

    fetch(`/api/checklist/?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        alert('Deleted Successfully');

        // Fetch updated checklist items after deleting
        fetch('/api/checklist')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
         // alert('Deleted successfully');
          
      })
      .catch((error) => console.error(error));
    
  };
  const handleCheckboxChange = (id) => {
    const isChecked = checkedItems[id];
    setCheckedItems({ ...checkedItems, [id]: !isChecked }); // Toggle checked state

    fetch(`/api/form/status?id=${id}&status=${!isChecked}`, { // Send update to API
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

  return (
    <>
    <TopBar/>
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
        {items.map((item) => (
          <li key={item.id} className="container boarder-black bg-gray-300 rounded-lg shadow-lg p-6 h-28 items-center mb-4">
            <div className='flex items-center'>
            {/* <input
            type="checkbox"
            id={`checkbox-${item.id}`} // Use unique IDs for checkboxes
            className="form-checkbox h-5 w-5 text-green-500"
            checked={checkedItems[item.id]} // Reflect checked state
            onChange={() => handleCheckboxChange(item.id)}
          /> */}
              <span className="ml-2 mb-2 text-bold">{item.item}</span>
            </div>
            {/* <div className="mt-2 flex items-start">
              <InputSection />
            </div> */}
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
        ))}
      </ul>
      {/* <FormDisplay items={items} /> */}
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