import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import AssignTransporter from '../AssignTransporter/AssignTransporter';
import "./RequestsTable.css";

function RequestsTable({ data, title, showTitleAndSearch = true }) {

  const [requests, setData] = useState(data);
  const [openDialog, setOpenDialog] = useState(false); // إضافة الـ state لإدارة فتح الـ Dialog
  const [selectedRequestId, setSelectedRequestId] = useState(null); // إضافة state لتخزين ID الطلب

  useEffect(() => {
    setData(data); // تحديث البيانات عندما تتغير
  }, [data]);

  if (!requests.length) {
    return <div className='background-message'>No results found</div>;
  }

  const handleReject = (value, id) => {
    if (value === "rejected") {
      setData(requests.filter((item) => item.id !== id));
    }
    //add delete code from DB?
  };

  const handleOpenDialog = (id) => {
    setSelectedRequestId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequestId(null); // Reset the selected request ID
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 , headerAlign: 'center'},
    { field: 'manufacturerName', headerName: 'Manufacturer Name', width: 200, headerAlign: 'center' },
    { field: 'supplyingItems', headerName: 'Supplying Items', width: 170, headerAlign: 'center',
      renderCell: (params) => (
        <div className="cell-content">
          {params.row.supplyingItems && params.row.supplyingItems.map((item, index) => (
            <div 
              key={index}
              className={`supplying-item ${index !== params.row.supplyingItems.length - 1 ? 'item-with-border' : ''}`}>
              {item}
            </div>
          ))}
        </div>
      )
    },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90, headerAlign: 'center',
      renderCell: (params) => (
        <div className="cell-content">
          {params.row.quantity && params.row.quantity.map((item, index) => (
            <div key={index}
              className={`supplying-item ${index !== params.row.quantity.length - 1 ? 'item-with-border' : ''}`}>
              {item}
            </div>
          ))}
        </div>
      )
    },
    { field: 'price', headerName: 'Price', type: 'number', width: 70 , headerAlign: 'center'},
    { field: 'status', headerName: 'Status', width: 130, headerAlign: 'center',
      renderCell: (params) => {
        if (!(params.row.status =='rejected' || params.row.status =='delivered' ) ) {
          return (
            <div>
              <select name="status" id="status" onChange={(e) => handleReject(e.target.value, params.row.id)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="inProgress">In progress</option>
                <option value="delivered">Delivered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          );
        }else {
          return (
            <div>
              {params.row.status === "rejected" && "Rejected"}
              {params.row.status === "delivered" && "Delivered"}
            </div>
          );
        }
      }
    },
    { field: 'arrivalCity', headerName: 'Arrival city', width: 140, headerAlign: 'center' },
    { field: 'assignTransport', headerName: 'Assign Transport', width: 170, headerAlign: 'center',
      renderCell: (params) => {
        if (!(params.row.status =='rejected' || params.row.status =='delivered' )) {
          return (
            <div className='buttonDiv'>
              
                <button className='tableButton' 
                onClick={() => handleOpenDialog(params.row.id)}>
                Assign Transporter
                </button> 
            </div>
          );
        }else {
          return (
            <div>
              {params.row.status === "delivered" && "Transport Assigned"}
            </div>
          );
        }
      }
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className='RequestsTable'>
     {showTitleAndSearch && ( // Conditionally render the title and search box
        <div className="header-row">
          <div className="title">{title}</div>
          <div className="search-container">
            <div className='search-label'>Search by Name / ID</div>
            <input
              type="search"
              placeholder="Search by Name / ID"
              className="input-with-icon"
            />
          </div>
        </div>
      )}
      <DataGrid
        rows={requests} disableRowSelectionOnClick 
        getRowHeight={() => 'auto'}
        columns={columns}
        autoHeight
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          '& .MuiDataGrid-cell': {textAlign: 'center'},
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        }} 
      />

      {/* إضافة مكون AssignTransporter هنا ليظهر كـ Dialog */}
    {openDialog && (
      <AssignTransporter 
        requestId={selectedRequestId} 
        onClose={handleCloseDialog} 
        onRequestSent={handleCloseDialog} // Pass the function to close the dialog
      />
    )}
    </div>
  );
}

RequestsTable.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  isPrevious: PropTypes.bool,
  showTitleAndSearch: PropTypes.bool // New prop for controlling title and search box visibility
};

export default RequestsTable;
