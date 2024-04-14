"use client";
import React, { useState, useEffect } from 'react';
import { Spacer } from '@nextui-org/react';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Link from 'next/link';
import TopBar from '@/components/topbar';
import InputSection from '@/components/input';

const FormDisplay = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/checklist')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  const handleCommentChange = (itemId, comment) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, comment } : item
      )
    );
  };

  const handleCommentSubmit = async (itemId, comment) => {
    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checklist_id: itemId,
          comment,
        }),
      });

      if (response.ok) {
        console.log('Comment added successfully');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4 bg-gray-200 pt-8 mt-10 border border-gray-600 rounded">
        <h1 className="text-extrabold text-3xl text-center mb-8">
          SYSTEMS ADMINISTRATOR CHECKLIST
        </h1>
        <Link href="/dashboard">
          <div className="flex items-end justify-end">
            <HiOutlinePencilSquare className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer" />
          </div>
        </Link>
        <div>
          {items.length === 0 ? (
            <div>No fields added yet.</div>
          ) : (
            items.map((item) => (
              <div
                className={`container border-black rounded-lg shadow-lg p-6 h-38 items-center mb-4 ${
                  item.checklist ? 'bg-green-500' : 'bg-gray-300'
                }`}
                key={item.id}
              >
                <div className="flex text-extrabold">
                  <input
                    type="checkbox"
                    checked={item.checklist}
                    onChange={() => {}}
                  />
                  <span className="ml-4 mb-2 text-black text-extrabold">{item.item}</span>
                </div>
                <Spacer />
                <InputSection />
                {/* <input
                  type="text"
                  value={item.comment || ''}
                  placeholder="Add a comment..."
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                  onBlur={() => handleCommentSubmit(item.id, item.comment)}
                /> */}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FormDisplay;