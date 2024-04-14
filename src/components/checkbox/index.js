"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import { Input, Spacer } from "@nextui-org/react";
import { FaArrowRight } from "react-icons/fa";

const Checkbox = () => {
  const [checklist, setChecklist] = useState([]);
  const [newCheckbox, setNewChecklist] = useState('');
  const [capturedChecklist, setCapturedChecklist] = useState('');
  const [showInput, setShowInput] = useState(true); // Added state to control visibility

  useEffect(() => {
    fetch('/api/form')
      .then((response) => response.json())
      .then((data) => setChecklist(data))
      .catch((error) => console.error(error));
  }, []);

  const handleChecklistChange = (e) => {
    setNewChecklist(e.target.value);
  };

  const handleAddChecklist = async () => {
    await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checklist: newChecklist }),
    })
      .then((response) => response.json())
      .then(() => {
        setCapturedChecklist(newCheckbox);
        setNewChecklist('');
        fetch('/api/form')
          .then((response) => response.json())
          .then((data) => setChecklist(data))
          .finally(() => setShowInput(false)); // Hide input after updates
      });
  };

  // ... other handlers (edit and delete) remain unchanged

  return (
    <>
      <main>
        {/* <div className="flex items-center">
          {comments.map((comment) => (
            <div key={comment.id} className="my-4">
              <p>{comment.comment}</p>
            </div>
          ))}
          {showInput && ( // Conditionally render input and arrow */}
            <>
             <input
            type="checkbox"
            id={`checkbox-${item.id}`} // Use unique IDs for checkboxes
            className="form-checkbox h-5 w-5 text-green-500"
            checked={checkedItems[item.id]} // Reflect checked state
            onChange={() => handleChecklistChange(item.id)}
          />
              <FaArrowRight className="ml-4" onClick={handleAddChecklist} />
            </>
          
          <p className="ml-4">{capturedChecklist}</p>
        {/* </div> */}
      </main>
    </>
  );
};

export default Checkbox;