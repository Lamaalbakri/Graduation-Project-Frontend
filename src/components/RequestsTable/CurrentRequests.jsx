import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import { searchCurrentRequestById, searchCurrentRequestByMName, fetchAllCurrentRequests } from '../../api/rawMaterialRequestAPI';

function CurrentRequests() {
  const [query, setQuery] = useState('');
  const [rawMaterialRequests, setRawMaterialRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(null);


  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllCurrentRequests(); // استدعاء دالة جلب جميع الطلبات
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

    // Regex to validate MongoDB ObjectId
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (objectIdRegex.test(searchQuery)) {
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request._id.toLowerCase().includes(searchQuery)
        );
        setFilteredRequests(filtered.length > 0 ? filtered : []);
      } else {
        try {
          const requestData = await searchCurrentRequestById(searchQuery); // استدعاء الدالة من ملف API
          if (requestData === null) {
            setFilteredRequests([]); // إذا كانت النتيجة null، قم بتعيين مصفوفة فارغة
          } else {
            setFilteredRequests([requestData]); // عرض النتيجة التي تم العثور عليها
          }
        } catch (error) {
          console.error('Error fetching request by id:', error);
          setFilteredRequests([]);
        }
      }
    } else {
      // البحث بالاسم باستخدام البيانات التي تم جلبها بالفعل
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request.manufacturerName.toLowerCase().includes(searchQuery)
        );
        setFilteredRequests(filtered.length > 0 ? filtered : []);
      } else {
        try {
          const requestData = await searchCurrentRequestByMName(searchQuery); // استدعاء البحث من API إذا لم تكن البيانات موجودة محلياً
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
        <div className="title">Current Requests</div>
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

export default CurrentRequests