import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import { searchPreviousRequestById, fetchAllPreviousRequests, searchPreviousRequestByMName } from '../../api/rawMaterialRequestAPI';

function PreviousRequests() {
  const [query, setQuery] = useState('');
  const [rawMaterialRequests, setRawMaterialRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(null);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllPreviousRequests(); // استدعاء دالة جلب جميع الطلبات
        setRawMaterialRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    getRequests(); // استدعاء الدالة عند تحميل المكون لأول مرة
  }, []);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();
    setQuery(searchQuery);

    // Regex to validate MongoDB 
    const validShortId = /^m?[0-9a-z]{8}$/;
    let foundResult = false;

    if (validShortId.test(searchQuery)) {
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request.shortId?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // تم العثور على النتيجة
        }
      } if (!foundResult) {
        try {
          const requestData = await searchPreviousRequestById(searchQuery); // استدعاء الدالة من ملف API
          if (requestData) {
            setFilteredRequests([requestData]);
            foundResult = true; // تم العثور على النتيجة
          } else {
            setFilteredRequests([]); // لا توجد نتائج
          }
        } catch (error) {
          console.error('Error fetching request by id:', error);
          setFilteredRequests([]);
        }
      }
    } if (!foundResult) {
      // البحث بالاسم باستخدام البيانات التي تم جلبها بالفعل
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request.manufacturerName?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // تم العثور على النتيجة
        }
      } if (!foundResult) {
        try {
          const requestData = await searchPreviousRequestByMName(searchQuery); // استدعاء البحث من API إذا لم تكن البيانات موجودة محلياً
          setFilteredRequests(requestData ? [requestData] : []);
        } catch (error) {
          console.error('Error fetching request by name:', error);
          setFilteredRequests([]);
        }
      }
    }
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
      {rawMaterialRequests && filteredRequests.length ? ( // Conditional rendering
        <RequestsTable data={filteredRequests} />
      ) : (
        <p className='background-message'>
          {filteredRequests && filteredRequests.length === 0 ? 'No requests found' : 'Loading requests...'}
        </p> // Display a loading message until data is available
      )}
    </div>
  );
}

export default PreviousRequests;
