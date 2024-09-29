import { useState } from 'react';
import { searchCurrentRequestById, fetchAllCurrentRequests, fetchAllPreviousRequests, searchPreviousRequestById } from '../../api/rawMaterialRequestAPI';
import RequestsTable from '../RequestsTable/RequestsTable';
import "./Search.css";

function Search() {
  const [query, setQuery] = useState(""); // Holds the search input
  const [hasSearched, setHasSearched] = useState(false); // Tracks if search has been performed
  const [filteredRequests, setFilteredRequests] = useState([]); // Holds filtered data
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Handle search query change
  const handleSearch = async (e) => {
    const searchQuery = e.target.value.trim(); // Trim the input to avoid unnecessary spaces
    setQuery(searchQuery);
    setHasSearched(!!searchQuery); // Update hasSearched to true if query is not empty

    if (!searchQuery) {
      setFilteredRequests([]); // Clear results if input is empty
      return;
    }

    setLoading(true); // Start loading
    try {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/; // MongoDB ObjectId validation regex

      if (objectIdRegex.test(searchQuery)) {
        // Search by ID (for both current and previous requests)

        // محاولة البحث عن current request مع التعامل مع الأخطاء
        let currentRequest = null;
        try {
          currentRequest = await searchCurrentRequestById(searchQuery);
        } catch (error) {
          console.warn("Current request not found:", error);
        }

        // محاولة البحث عن previous request مع التعامل مع الأخطاء
        let previousRequest = null;
        try {
          previousRequest = await searchPreviousRequestById(searchQuery);
        } catch (error) {
          console.warn("Previous request not found:", error);
        }

        // تجميع النتائج فقط إذا كانت غير null
        const results = [];
        if (currentRequest) results.push(currentRequest);
        if (previousRequest) results.push(previousRequest);

        setFilteredRequests(results.length > 0 ? results : []); // Show results if found
      } else {
        // Search by Name (fetch all and filter)
        const [currentRequests, previousRequests] = await Promise.all([
          fetchAllCurrentRequests(),
          fetchAllPreviousRequests(),
        ]);

        // Filter both collections based on the query
        const filtered = [
          ...currentRequests.filter((request) =>
            request.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          ...previousRequests.filter((request) =>
            request.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        ];

        setFilteredRequests(filtered);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setFilteredRequests([]); // Handle errors by resetting the filtered requests
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="search">
      <div className="header-row">
        <div className="title">Search For Requests</div>
        <div className="search-container">
          <div className="search-label">Search by Name / ID</div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            value={query}
            onChange={handleSearch}
            className="input-with-icon"
          />
        </div>
      </div>

      {hasSearched && (
        loading ? (
          <div className="background-message">Loading...</div>
        ) : (
          filteredRequests.length > 0 ? (
            <RequestsTable
              data={filteredRequests}
              title="Filtered Requests"
              showTitleAndSearch={false}
            />
          ) : (
            <div className="background-message">No results found</div>
          )
        )
      )}
    </div>
  );
}

export default Search;
