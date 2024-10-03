import { useState } from 'react';
import { searchCurrentRequestById, fetchAllCurrentRequests, fetchAllPreviousRequests, searchPreviousRequestById } from '../../api/rawMaterialRequestAPI';
import RequestsTable from './RequestsTable';
import "./RequestsTable.css";

function Search() {
  const [query, setQuery] = useState(""); // Holds the search input
  const [hasSearched, setHasSearched] = useState(false); // Tracks if search has been performed
  const [filteredRequests, setFilteredRequests] = useState([]); // Holds filtered data
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Handle search query change
  const handleSearch = async (e) => {
    const searchQuery = e.target.value.trim().toLowerCase(); // Trim the input to avoid unnecessary spaces
    setQuery(searchQuery);
    setHasSearched(!!searchQuery); // Update hasSearched to true if query is not empty

    if (!searchQuery) {
      setFilteredRequests([]); // Clear results if input is empty
      return;
    }

    setLoading(true); // Start loading
    try {
      const validShortId = /^m?[0-9a-z]{8}$/;
      let foundResult = false;
      const [currentRequests, previousRequests] = await Promise.all([
        fetchAllCurrentRequests(),
        fetchAllPreviousRequests(),
      ]);

      if (validShortId.test(searchQuery)) {
        // Search by ID (for both current and previous requests)
        const filtered = [
          ...currentRequests.filter((request) =>
            request.shortId.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          ...previousRequests.filter((request) =>
            request.shortId.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        ];
        if (filtered.length > 0) {
          // إذا تم العثور على نتائج بالـ ID، عرض النتائج وإيقاف البحث
          setFilteredRequests(filtered);
          foundResult = true; // تم العثور على نتائج بالـ ID
        }
      } if (!foundResult) {
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
      //console.error("Error fetching requests:", error);
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
// search by id without fiching all data
// استخدم Promise.allSettled للبحث في كلا الجدولين في وقت واحد
// const [currentResult, previousResult] = await Promise.allSettled([
//   searchCurrentRequestById(searchQuery),
//   searchPreviousRequestById(searchQuery),
// ]);

// // تجميع النتائج فقط إذا تم العثور على بيانات
// const results = [];

// if (currentResult.status === 'fulfilled' && currentResult.value) {
//   results.push(currentResult.value);
// }

// if (previousResult.status === 'fulfilled' && previousResult.value) {
//   results.push(previousResult.value);
//setFilteredRequests(results.length > 0 ? results : []); // Show results if found
// }
