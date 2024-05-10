import React from 'react';

const Card = ({ title, description, link }) => {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow">
      <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4">
        <h3 className="text-2xl text-center font-semibold mb-2">{title}</h3>
        <p className="text-white">{description}</p>
      </a>
    </div>
  );
};

export default Card;