import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import RequestsTable from './RequestsTable';
import {
  searchCurrentRequestById,
  searchCurrentRequestByMName,
  fetchAllCurrentRequests
} from '../../../api/rawMaterialRequestAPI';

function CurrentRequests() {
  const [query, setQuery] = useState('');
  const [rawMaterialRequests, setRawMaterialRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);


  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllCurrentRequests(); // Call the fetch all requests function
        setRawMaterialRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    getRequests(); // Call the function when the component is first loaded.
  }, []);

  const handleSearch = async (e) => {
    const originalQuery = e.target.value;
    setQuery(originalQuery);
    const searchQuery = originalQuery.trim().toLowerCase();

    const validShortId = /^m?[0-9a-z]{8}$/;
    let foundResult = false;

    //check if it is an id
    if (searchQuery.length <= 9 && validShortId.test(searchQuery)) {
      //check if there are requests
      if (rawMaterialRequests) {
        //Search by id using data already fetched
        const filtered = rawMaterialRequests.filter((request) =>
          request.shortId?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      } if (!foundResult) {
        try {
          //search by id in back-end
          const requestData = await searchCurrentRequestById(searchQuery); // Call search from API if data is not present locally
          if (requestData.error) {
            if (requestData.error.includes('problem with the server')) {
              notification.error({
                message: "Error",
                description: "There is a problem with the server. Please contact customer service.",
                placement: "top",
                icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
              });
            }
          } else {
            setFilteredRequests([requestData]);
            foundResult = true; // Result found
          }
        } catch (error) {
          setFilteredRequests([]); // Reset requests on error
        }
      }
    } if (!foundResult) {
      // Search by name using data already fetched
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request.manufacturerName?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      } if (!foundResult) {
        //Search by name in back-end
        try {
          const requestData = await searchCurrentRequestByMName(searchQuery); // Call search from API if data is not present locally
          if (requestData.error) {
            if (requestData.error.includes('problem with the server')) {
              notification.error({
                message: "Error",
                description: "There is a problem with the server. Please contact customer service.",
                placement: "top",
                icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
              });
            }
          } else {
            setFilteredRequests([requestData]);
            // foundResult = true; // Result found
          }
        } catch (error) {
          // notification.error({
          //   message: "Error",
          //   description: error.message || "There is a problem with the server. Please contact customer service.",
          //   placement: "top",
          //   icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
          // });
          setFilteredRequests([]);
        }
      }
    }
  };



  return (
    <div className='ManageRawMaterial'>
      <div className="ManageRawMaterial-header-row">
        <div className="ManageRawMaterial-title">Current Requests</div>
        <div className="ManageRawMaterial-search-container">
          <div className='ManageRawMaterial-search-label'>Search by Name / ID</div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            value={query}
            onChange={handleSearch}
            className="ManageRawMaterial-input-with-icon"
          />
        </div>
      </div>

      {rawMaterialRequests && filteredRequests.length ? ( // Conditional rendering
        <RequestsTable data={filteredRequests} />
      ) : (
        <p className='ManageRawMaterial-background-message'>
          {filteredRequests && filteredRequests.length === 0 ? 'No requests found' : 'Loading requests...'}
        </p> // Display a loading message until data is available
      )}

    </div>
  );
}

export default CurrentRequests