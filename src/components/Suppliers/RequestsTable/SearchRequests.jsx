import { useState } from "react";
import RequestsTable from "./RequestsTable";
import "./RequestsTable.css";
import {
  fetchAllCurrentRequests,
  fetchAllPreviousRequests,
} from "../../../api/rawMaterialRequestAPI";

function Search() {
  const [query, setQuery] = useState(""); // Holds the search input
  const [hasSearched, setHasSearched] = useState(false); // Tracks if search has been performed
  const [filteredRequests, setFilteredRequests] = useState([]); // Holds filtered data
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Handle search query change
  const handleSearch = async (e) => {
    const originalQuery = e.target.value;
    setQuery(originalQuery);
    const searchQuery = originalQuery.trim().toLowerCase();

    setHasSearched(!!searchQuery); // Update hasSearched to true if query is not empty

    if (!searchQuery) {
      setFilteredRequests([]); // Clear results if input is empty
      return;
    }

    setLoading(true); // Start loading
    try {
      const validShortId = /^m?[0-9a-z]{8}$/;
      let foundResult = false;
      //fech all data to searsh
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
          // If results are found by ID, display the results and stop searching.
          setFilteredRequests(filtered);
          foundResult = true; // result found
        }
      }
      if (!foundResult) {
        // Filter both collections based on the query
        const filtered = [
          ...currentRequests.filter((request) =>
            request.manufacturerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ),
          ...previousRequests.filter((request) =>
            request.manufacturerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
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
    <div className="ManageRawMaterial">
      <div className="ManageRawMaterial-header-row">
        <div className="ManageRawMaterial-title">Search For Requests</div>
        <div className="ManageRawMaterial-search-container">
          <div className="ManageRawMaterial-search-label">Search by Name / ID</div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            value={query}
            onChange={handleSearch}
            className="ManageRawMaterial-input-with-icon"
          />
        </div>
      </div>

      {hasSearched &&
        (loading ? (
          <div className="ManageRawMaterial-background-message">Loading...</div>
        ) : filteredRequests.length > 0 ? (
          <RequestsTable data={filteredRequests} />
        ) : (
          <div className="ManageRawMaterial-background-message">No results found</div>
        ))}
    </div>
  );
}

export default Search;
