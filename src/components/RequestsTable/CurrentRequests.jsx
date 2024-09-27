import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';


function CurrentRequests() {
  const [query, setQuery] = useState('');
  const [rawMaterialRequests, setRawMaterialRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState(null);
  const [isSearchingById, setIsSearchingById] = useState(false);
  useEffect(()=>{
    //run this function when it is frist render
    const fetchRowMatirealRequests= async ()=>{
      const response = await fetch('http://localhost:8500/api/v1/rawMaterialRequest')
      
      if(!response.ok){
        throw new Error(`Error: ${response.status}`);
      }
      const json= await response.json()
      setRawMaterialRequests(json.data);
      setFilteredRequests(json.data); 
    
    }
    fetchRowMatirealRequests();
  },[]);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setQuery(searchQuery);

    // Regex to validate MongoDB ObjectId
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (objectIdRegex.test(searchQuery)) {
      setIsSearchingById(true);
      try {
        const response = await fetch(`http://localhost:8500/api/v1/rawMaterialRequest/${searchQuery}`);
        if (response.ok) {
          const json = await response.json();
          setFilteredRequests([json.data]); // عرض النتيجة التي تم العثور عليها
        } else {
          setFilteredRequests([]); // إذا لم يتم العثور على طلب، عرض لا شيء
        }
      } catch (error) {
        console.error('Error fetching request by id:', error);
        setFilteredRequests([]);
      }
    } else {
      setIsSearchingById(false);
      // إذا كان البحث باستخدام الاسم
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter(
          (request) =>
            request.manufacturerName.toLowerCase().includes(searchQuery)
        );
        setFilteredRequests(filtered);
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

        {rawMaterialRequests ? ( // Conditional rendering
      <RequestsTable data={filteredRequests} />
    ) : (
      <p>Loading requests...</p> // Display a loading message until data is available
    )}
        
    </div>
  );
}

export default CurrentRequests