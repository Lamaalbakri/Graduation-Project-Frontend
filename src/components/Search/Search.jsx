import { useState, useMemo } from 'react';
import { previousRequests, currentRequests } from '../RequestsTable/dummyData';
import RequestsTable from '../RequestsTable/RequestsTable';

function Search() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // دمج الطلبات بدون تعيين isPrevious
  const allRequests = useMemo(() => [
    ...previousRequests,
    ...currentRequests,
  ], []);

  // تصفية البيانات بناءً على المدخلات في مربع البحث
  const filteredRequests = useMemo(() => 
    allRequests.filter(request => {
      const manufacturerName = request.manufacturerName ? request.manufacturerName.toLowerCase() : "";
      const requestId = request.id ? request.id.toString() : "";
      return manufacturerName.includes(query.toLowerCase()) || requestId.includes(query);
    }), [query, allRequests]);

  // تحديث حالة البحث عندما يتغير الاستعلام
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setHasSearched(true);
  };

  return (
    <div className='Search'>
      <div className="header-row">
      <div className="title">Request Search</div>
        <div className="search-container">
          <div className='search-label'>Search by Name / ID</div>
        <input
          type="search"
          placeholder="Search by Name / ID"
          onChange={handleSearch}
          className="input-with-icon"
        />
        </div>
      </div>
      
      {hasSearched ? (
        filteredRequests.length > 0 ? (
          <RequestsTable 
            data={filteredRequests} 
            title="Filtered Requests"
          />
        ) : (
          <div>No results found</div>
        )
      ) : null}
    </div>
  );
}

export default Search;