/*import React, { useState, useEffect } from "react";
import TransportRequestsTable from "./TransportRequestsTable"; // تعديل اسم الجدول لطلبات النقل
import {
  searchTransportRequestById,
  fetchAllTransportRequests,
} from "../api/transportRequestAPI"; // تعديل API

function CurrentTransportRequests() {
  const [query, setQuery] = useState("");
  const [transportRequests, setTransportRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(null);

  const filterRequestsByServiceName = (requests, query) => {
    const searchQuery = query.toLowerCase();
    return requests.filter((request) =>
      request.transportServiceName.toLowerCase().includes(searchQuery)
    );
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllTransportRequests(); // استدعاء دالة جلب جميع الطلبات
        setTransportRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error("Error fetching transport requests:", error);
      }
    };
    getRequests(); // استدعاء الدالة عند تحميل المكون لأول مرة
  }, []);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();
    setQuery(searchQuery);

    // Regex to validate MongoDB ObjectId
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (objectIdRegex.test(searchQuery)) {
      try {
        const requestData = await searchTransportRequestById(searchQuery); // استدعاء الدالة من ملف API
        if (requestData === null) {
          setFilteredRequests([]); // إذا كانت النتيجة null، قم بتعيين مصفوفة فارغة
        } else {
          setFilteredRequests([requestData]); // عرض النتيجة التي تم العثور عليها
        }
      } catch (error) {
        console.error("Error fetching transport request by id:", error);
        setFilteredRequests([]);
      }
    } else {
      // إذا كان البحث باستخدام الاسم
      if (transportRequests) {
        const filtered = filterRequestsByServiceName(
          transportRequests,
          searchQuery
        );
        setFilteredRequests(filtered);
      }
    }
  };

  return (
    <div className="RequestsTable">
      <div className="header-row">
        <div className="title">Current Transport Requests</div>
        <div className="search-container">
          <div className="search-label">Search by Service Name / ID</div>{" "}
          <input
            type="search"
            placeholder="Search by Service Name / ID"
            value={query}
            onChange={handleSearch}
            className="input-with-icon"
          />
        </div>
      </div>

      {transportRequests && filteredRequests.length ? ( // Conditional rendering
        <TransportRequestsTable data={filteredRequests} />
      ) : (
        <p className="background-message">
          {filteredRequests && filteredRequests.length === 0
            ? "No transport requests found"
            : "Loading transport requests..."}
        </p> // Display a loading message until data is available
      )}
    </div>
  );
}

export default CurrentTransportRequests; */
