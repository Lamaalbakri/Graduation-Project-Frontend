import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import RequestsTableForDistributedGoods from "./RequestsTableForDistributedGoods";
import {
  fetchAllDistributorsGoodsPreviousRequests,
  deleteDistributorsGoodsPreviousRequestById,
  searchDistributorsGoodsPreviousRequestByMName,
} from "../../../api/distributerGoodsRequestsAPI";

function DistributedGoodsPreviousRequests() {
  const [query, setQuery] = useState("");
  const [goodsRequests, setGoodsRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(null);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllDistributorsGoodsPreviousRequests(); // Call the fetch all requests function
        setGoodsRequests(requests);
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

    const validShortId = /^r?[0-9a-z]{8}$/;
    let foundResult = false;

    //check if it is an id
    if (validShortId.test(searchQuery)) {
      //check if there are requests
      if (goodsRequests) {
        //Search by id using data already fetched
        const filtered = goodsRequests.filter((request) =>
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
          const requestData = await deleteDistributorsGoodsPreviousRequestById(
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
          setFilteredRequests([]);
        }
      }
    }
    if (!foundResult) {
      // Search by name using data already fetched
      if (goodsRequests) {
        const filtered = goodsRequests.filter((request) =>
          request.retailerName?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      }
      if (!foundResult) {
        try {
          //Search by name in back-end
          const requestData =
            await searchDistributorsGoodsPreviousRequestByMName(searchQuery); // Call search from API if data is not present locally
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
            // foundResult = true; // Result found
          }
        } catch (error) {
          // console.error('Error fetching request by name:', error);
          setFilteredRequests([]);
        }
      }
    }
  };

  return (
    <div className="ManageGoodsDistributors">
      <div className="ManageGoodsDistributors-header-row">
        <div className="ManageGoodsDistributors-title">Previous Requests</div>
        <div className="ManageGoodsDistributors-search-container">
          <div className="ManageGoodsDistributors-search-label">
            Search by Name / ID
          </div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            value={query}
            onChange={handleSearch}
            className="ManageGoodsDistributors-input-with-icon"
          />
        </div>
      </div>
      {goodsRequests && filteredRequests.length ? ( // Conditional rendering
        <RequestsTableForDistributedGoods data={filteredRequests} />
      ) : (
        <p className="ManageGoodsDistributors-background-message">
          {filteredRequests && filteredRequests.length === 0
            ? "No requests found"
            : "Loading requests..."}
        </p> // Display a loading message until data is available
      )}
    </div>
  );
}

export default DistributedGoodsPreviousRequests;
