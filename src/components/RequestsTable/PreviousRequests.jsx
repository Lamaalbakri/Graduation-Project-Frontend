import React, { useState } from 'react';
import RequestsTable from './RequestsTable';
import { previousRequests } from './dummyData';

function PreviousRequests() {
    const [query, setQuery] = useState('');
    const [filteredRequests, setFilteredRequests] = useState(previousRequests);
    
    const handleSearch = (e) => {
      const searchQuery = e.target.value.toLowerCase();
      const filtered = previousRequests.filter(
        (request) =>
          request.id.toString().includes(searchQuery) ||
          request.manufacturerName.toLowerCase().includes(searchQuery)
      );
      setQuery(searchQuery);
      setFilteredRequests(filtered);
    };
  
    return (
      <div className='RequestsTable'>
          <div className="header-row">
              <div className="title">Previous Requests</div>
              <div className="search-container">
                  <div className='search-label'>Search by Name / ID</div>
                  <input
                  type="search"
                  placeholder="Search by Name / ID"
                  value={query}
                  onChange={handleSearch}
                  className="input-with-icon"
                  />
              </div>
          </div>
          
          <RequestsTable data={filteredRequests} />
      </div>
    );
  }

export default PreviousRequests;
