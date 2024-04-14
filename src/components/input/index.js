"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import { Input, Spacer } from "@nextui-org/react";
import { FaArrowRight } from "react-icons/fa";

const InputSection = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [capturedComment, setCapturedComment] = useState('');
  const [showInput, setShowInput] = useState(true); // Added state to control visibility

  useEffect(() => {
    fetch('/api/form')
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error(error));
  }, []);

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // const handleAddComment = async () => {
  //   await fetch('/api/form?id=${id}', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ comment: newComment }),
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       setCapturedComment(newComment);
  //       setNewComment('');
  //       fetch('/api/form')
  //         .then((response) => response.json())
  //         .then((data) => setComments(data))
  //         .finally(() => setShowInput(false)); // Hide input after updates
  //     });
  // };

  const handleAddComment = (id, newComment) => {
    // Update a checklist item through the API
    fetch(`/api/form?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: newComment }),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch updated checklist items after editing
        fetch('/api/form')
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };


  return (
    <>
      <main>
        <div className="flex items-center">
          {items.map((item) => (
            <div key={item.id} className="my-4">
              <p>{item.comment}</p>
            </div>
          ))}
          {showInput && ( // Conditionally render input and arrow
            <>
              <Input
                className="w-100 mb-8 mt-2 rounded opacity-50"
                placeholder="Comments"
                value={newComment}
                onChange={handleNewCommentChange}
              />
              <FaArrowRight className="ml-4" onClick={() => {
                  const newItem = prompt('Add/Edit Comment');
                  if (newItem) {handleAddComment(item.id, newItem)} } }              
                />
            </>
          )}
          <p className="ml-4">{capturedComment}</p>
        </div>
      </main>
    </>
  );
};

export default InputSection;