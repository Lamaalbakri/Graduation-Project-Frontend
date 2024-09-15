import { useState, useMemo } from 'react';
import { previousRequests, currentRequests } from '../RequestsTable/dummyData';
import RequestsTable from '../RequestsTable/RequestsTable';
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Merging requests
  const allRequests = useMemo(() => [
    ...previousRequests,
    ...currentRequests,
  ], []);

  // Filtering data based on the search input
  const filteredRequests = useMemo(() => 
    allRequests.filter(request => {
      const manufacturerName = request.manufacturerName ? request.manufacturerName.toLowerCase() : "";
      const requestId = request.id ? request.id.toString() : "";
      return manufacturerName.includes(query.toLowerCase()) || requestId.includes(query);
    }), [query, allRequests]);

  // Handle search query change
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setHasSearched(!!e.target.value); // Update hasSearched based on whether there's input
  };

  return (
    <div className='search'>
      <div className="header-row">
      <div className="title">Search For Requests </div>
        <div className="search-container">
          <div className='search-label'>Search by Name / ID</div>
        <input
          type="search"
          placeholder="Search by Name / ID"
          onChange={handleSearch}
          className="input-with-icon"
        />
        </div>
      </div>
      
      {hasSearched ? (
        filteredRequests.length > 0 ? (
          <RequestsTable 
            data={filteredRequests} 
            title="Filtered Requests"
            showTitleAndSearch={false} // Hide title and search for this page
          />
        ) : (
          <div className='background-message'>No results found</div>
        )
      ) : null}
    </div>
  );
}

export default Search;