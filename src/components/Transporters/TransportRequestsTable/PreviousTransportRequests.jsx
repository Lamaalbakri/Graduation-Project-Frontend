import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import TransportRequestsTable from "./TransportRequestsTable";
import {
  fetchAllPreviousTransportRequests,
  searchTransportPreviousRequestById,
} from "../../../api/transportRequestsAPI";

function PreviousTransportRequests() {
  const [query, setQuery] = useState("");
  const [transportRequests, setTransportRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllPreviousTransportRequests(); // Call the fetch all requests function
        setTransportRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    getRequests(); // Call the function when the component is first loaded.
  }, []);

  const handleSearch = async (e) => {
    const originalQuery = e.target.value;
    setQuery(originalQuery);
    const searchQuery = originalQuery.trim().toLowerCase();

    const validShortId = /^t?[0-9a-z]{8}$/;
    let foundResult = false;

    //check if it is an id
    if (validShortId.test(searchQuery)) {
      //check if there are requests
      if (transportRequests) {
        //Search by id using data already fetched
        const filtered = transportRequests.filter((request) =>
          request.shortId?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      }
      if (!foundResult) {
        try {
          //search by id in back-end
          const requestData = await searchTransportPreviousRequestById(
            searchQuery
          ); // Call search from API if data is not present locally
          if (requestData.error) {
            if (requestData.error.includes("problem with the server")) {
              Modal.error({
                title: "Error",
                content:
                  "There is a problem with the server. Please contact customer service.",
                okButtonProps: {
                  className: "confirm-buttonn",
                },
              });
            }
          } else {
            setFilteredRequests([requestData]);
            foundResult = true; // Result found
          }
        } catch (error) {
          console.error("Error fetching request by id:", error);
          setFilteredRequests([]);
        }
      }
    } else {
      setFilteredRequests([]);
    }
  };

  return (
    <div className="TransportRequestsTable">
      <div className="TransportRequestsTable-header-row">
        <div className="TransportRequestsTable-title">
          Previous Transport Requests
        </div>
        <div className="TransportRequestsTable-search-container">
          <div className="TransportRequestsTable-search-label">
            Search by ID
          </div>
          <input
            type="search"
            placeholder="Search by ID"
            value={query}
            onChange={handleSearch}
            className="TransportRequestsTable-input-with-icon"
          />
        </div>
      </div>

      {transportRequests && filteredRequests.length ? ( // Conditional rendering
        <TransportRequestsTable data={filteredRequests} />
      ) : (
        <p className="TransportRequestsTable-background-message">
          {filteredRequests && filteredRequests.length === 0
            ? "No transport requests found"
            : "Loading requests..."}
        </p> // Display a loading message until data is available
      )}
    </div>
  );
}

export default PreviousTransportRequests;
