// src/components/Search.js
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing

const Searchs = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Create a navigate function
  const results = useSelector((state) => state.ui.searchResults);

  const handleSearch = (e) => {
   
  };

  const handleItemClick = (result) => {
    

  };

  useEffect(() => {
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.search-container') === null) {
        // Close the suggestions if clicked outside the search bar
        dispatch(setSearchResults([])); // Clear search results
      }
    };
  
    // Add event listener when the component mounts
    window.addEventListener('click', handleClickOutside);
  
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch]);
  
  return (
    <div className="relative">
      <div className="flex items-center border rounded-full bg-gray-50 shadow-inner px-4 py-2">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Type In..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-transparent focus:outline-none"
        />
      </div>
      {/* Dropdown Results */}
      {results.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          <ul>
            {results.map((result) => (
              <li 
                key={result.id} 
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleItemClick(result)}  // Call handleItemClick on click
              >
                {result.icon} {result.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Searchs;
