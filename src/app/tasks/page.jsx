"use client";
import { useState, useEffect } from 'react';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Spacer } from '@nextui-org/react';
import TopBar from '@/components/topbar';
import Link from 'next/link';
import User from '@/components/input';
import { useUser } from '@clerk/clerk-react';
import ChecklistPDF from '@/components/checklistpdf';
import { CldUploadButton } from 'next-cloudinary';

const Task = () => {
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState({});
  const [filterOption, setFilterOption] = useState('all');

 const [filePreviews, setFilePreviews] = useState(() => {
  const storedFilePreviews = localStorage.getItem('filePreviews');
  return storedFilePreviews ? JSON.parse(storedFilePreviews) : {};
});
  const [commentsCleared, setCommentsCleared] = useState(() => {
    const storedCommentsCleared = localStorage.getItem('commentsCleared');
    return storedCommentsCleared ? JSON.parse(storedCommentsCleared) : false;
  });
  const [checkedItems, setCheckedItems] = useState(() => {
    const storedCheckedItems = localStorage.getItem('checkedItems');
    return storedCheckedItems ? JSON.parse(storedCheckedItems) : {};
  });
  const [hiddenUploadItems, setHiddenUploadItems] = useState(() => {
    const storedHiddenUploadItems = localStorage.getItem('hiddenUploadItems');
    return storedHiddenUploadItems ? JSON.parse(storedHiddenUploadItems) : {};
  });
  const [showUpload, setShowUpload] = useState(() => {
    const storedShowUpload = localStorage.getItem('showUpload');
    return storedShowUpload ? JSON.parse(storedShowUpload) : true;
  });
  const user = useUser();
  const [showUserDetails, setShowUserDetails] = useState(() => {
    const storedShowUserDetails = localStorage.getItem('showUserDetails');
    return storedShowUserDetails ? JSON.parse(storedShowUserDetails) : {};
  });

  useEffect(() => {
    window.localStorage.setItem('showUserDetails', JSON.stringify(showUserDetails));
  }, [showUserDetails]);

  useEffect(() => {
    window.localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    window.localStorage.setItem('showUpload', JSON.stringify(showUpload));
  }, [showUpload]);

  useEffect(() => {
    window.localStorage.setItem('hiddenUploadItems', JSON.stringify(hiddenUploadItems));
  }, [hiddenUploadItems]);

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
      .then((data) => {
        console.log(data); // Log the fetched data
        setItems(data);
      })
      .catch((error) => console.error(error));
  }, [filterOption]);

  useEffect(() => {
    console.log(items); // Log the updated value of items
  }, [items]);
  
  const handleEditItem = (id, newComment, checkbox = 1) => {
    fetch(`/api/checklist?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: newComment, checkbox }), // Pass checkbox value
    })
      .then((response) => response.json())
      .then(() => {
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
        setShowUserDetails({});
        setHiddenUploadItems({});
        setFilePreviews({});
        fetch(`/api/checklist?filter=${filterOption}`)
          .then((response) => response.json())
          .then((data) => {
            setItems(data);
            // Update the checkbox field to 0 for all cleared items
            data.forEach((item) => {
              if (checkedItems[item.id]) {
                handleEditItem(item.id, item.comment, 0); // Pass 0 as the checkbox value
                setCheckedItems({ ...checkedItems, [item.id]: false }); // Set checkbox value to false
              }
            });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };
  const handleClearFilePreviews = () => {
    setFilePreviews({}); // Clear the file previews
  };
  //to update
  //another update
  
  useEffect(() => {
    window.localStorage.setItem('filePreviews', JSON.stringify(filePreviews));
  }, [filePreviews]);
  
  

  const handleFileSelection = (itemId, files) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prevFilePreviews) => {
          const newFilePreviews = { ...prevFilePreviews, [itemId]: reader.result };
          localStorage.setItem('filePreviews', JSON.stringify(newFilePreviews));
          return newFilePreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate JSX elements using for loop
  const itemsJSX = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    itemsJSX.push(
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
        {filePreviews[item.id] && (
          <div>
            <img src={filePreviews[item.id]} alt="File Preview" style={{ maxWidth: '100px' }} />
          </div>
        )}
        {!hiddenUploadItems[item.id] && showUpload && (
          <div>
            <label htmlFor={`file-${item.id}`} className="block mb-2">
            </label>
            <input
              type="file"
              id={`file-${item.id}`}
              onChange={(e) => handleFileSelection(item.id, e.target.files)}
              className="mb-4"
            />
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
                  setCheckedItems({ ...checkedItems, [item.id]: true });
                  setShowUserDetails({ ...showUserDetails, [item.id]: true });
                  setHiddenUploadItems({ ...hiddenUploadItems, [item.id]: true });
                }
              }}
            >
              Mark as Done
            </button>
          </div>
          <Spacer />
        </div>
        {showUserDetails[item.id] && user.user && (
          <div>
            <p>Changed by: {user.user.fullName}</p>
          </div>
        )}
      </li>
    );
  }

  return (
    <>
      <TopBar />
      <div className="container mx-auto p-4 bg-white pt-8 mt-10 border border-green-600 rounded">
        <h1 className='text-extrabold text-3xl text-green-700 text-center mb-8'>SYSTEMS ADMINISTRATOR CHECKLIST</h1>
        <div className="flex items-end justify-between mb-4">
          <div className="text-green-700">
            <label htmlFor="filter">Filter by :</label>
            <select
              id="filter"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="ml-2 bg-gray-200"
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
              Clear Content
            </button>
          </div>
          <div className="flex items-center">
            <ChecklistPDF items={items} />
            <Link href="/dashboard">
              <HiOutlinePencilSquare className="w-4 h-4 sm:w-8 sm:h-8 cursor-pointer" />
            </Link>
          </div>
        </div>

        <ul>
          {/* Render generated JSX elements */}
          {itemsJSX}
        </ul>
      </div>
    </>
  );
};

export default Task;

