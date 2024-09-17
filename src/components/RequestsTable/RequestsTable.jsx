import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import AssignTransporter from '../AssignTransporter/AssignTransporter';
import "./RequestsTable.css";
import { MessageOutlined} from '@ant-design/icons';
import MessageDialog from '../Dialog/MessageDialog';
import TrackingDialog from '../Dialog/TrackingDialog';



function RequestsTable({ data, title, showTitleAndSearch = true }) {
  const [requests, setData] = useState(data);
  const [openDialog, setOpenDialog] = useState(false); // إضافة الـ state لإدارة فتح الـ Dialog
  const [selectedRequestId, setSelectedRequestId] = useState(null); // إضافة state لتخزين ID الطلب
  const [openMessageDialog, setOpenMessageDialog] = useState(false); // لحوار الرسالة
  const [openTrackingDialog, setOpenTrackingDialog] = useState(false); // لحوار الخيارات الأخرى
  const [selectedStatus, setSelectedStatus] = useState(""); // لإدارة الحالة المختارة

  useEffect(() => {
    setData(data); // تحديث البيانات عندما تتغير
  }, [data]);

  if (!requests.length) {
    return <div className='background-message'>No results found</div>;
  }

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "accepted") {
      handleOpenDialog(id); // فتح الـ Dialog عند اختيار "Accepted"
    } else if (newStatus === "rejected") {
      handleReject(id); // تنفيذ عملية الحذف عند اختيار "Rejected"
    } else {
      setData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    }
  };

  const handleReject = (id) => {
      setData((prevRequests) => prevRequests.filter((item) => item.id !== id));
    //add delete code from DB?
  };

  const handleOpenDialog = (id) => { 
    const rowExists = requests.some((request) => request.id === id);
    if (rowExists) {
      setSelectedRequestId(id);
      setOpenDialog(true);
    } else {
      console.error(`No row with id ${id} found`);
    }
  };

  const handleCloseDialog = (wasRequestSent) => {
    setOpenDialog(false);
    if (wasRequestSent) {
      // لا تقم بتغيير الحالة إلى Pending إذا تم إرسال الطلب بنجاح
      setData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequestId
            ? { ...request, status: "accepted" } // الحفاظ على الحالة Accepted
            : request
        )
      );
    } else {
      // إرجاع الحالة إلى Pending إذا لم يتم إرسال الطلب
      setData((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequestId
            ? { ...request, status: "pending" }
            : request
        )
      );
    }
    setSelectedRequestId(null); // Reset the selected request ID
  };

  const handleOpenMessageDialog = (id) => {
    setSelectedRequestId(id);
    setOpenMessageDialog(true);
  };
  
  const handleTrackingDialog = (id,status) => {
    setSelectedRequestId(id);
    setSelectedStatus(status); // حفظ الحالة المختارة
    setOpenTrackingDialog(true);
  };
  
  const handleCloseDialogs = () => {
    setOpenMessageDialog(false);
    setOpenTrackingDialog(false);
    setSelectedRequestId(null);
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 , headerAlign: 'left'},
    { field: 'manufacturerName', headerName: 'Manufacturer Name', width: 200, headerAlign: 'left' },
    { field: 'requestDate', headerName: 'Date', width: 140, headerAlign: 'left' },
    { field: 'supplyingItems', headerName: 'Supplying Items', width: 170, headerAlign: 'left',
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
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90, headerAlign: 'left',
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
    { field: 'price', headerName: 'Price', type: 'number', width: 70 , headerAlign: 'left'},
    { field: 'status', headerName: 'Status', width: 130, headerAlign: 'left',
      renderCell: (params) => {
        if (!(params.row.status =='rejected' || params.row.status =='delivered' ) ) {
          return (
            <div>
              <select name="status" id="status" onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                value={params.row.status}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted </option>
                <option value="inProgress">In Progress</option>
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
    { field: 'arrivalCity', headerName: 'Arrival city', width: 140, headerAlign: 'left' },
    { field: 'action', headerName: 'Action', width: 140, headerAlign: 'left', renderCell: (params)=> {
      return (
        <div>
          <div className="action-buttons">
            <MessageOutlined className='table-icon message-icon' onClick={() => handleOpenMessageDialog(params.row.id)} />
            <div >
              <button className='tracking-icon' onClick={() => handleTrackingDialog(params.row.id, params.row.status)}></button>
            </div>
          </div>
      </div>
      );
    } },
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
          '& .MuiDataGrid-cell': {textAlign: 'left'},
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        }} 
      />

      {/* إضافة مكون AssignTransporter هنا ليظهر كـ Dialog */}
    {openDialog && (
      <AssignTransporter 
        requestId={selectedRequestId} 
        onClose={() => handleCloseDialog(false)}// تمرير false إذا أغلق المستخدم الـ Dialog بدون إرسال 
        onRequestSent={() => handleCloseDialog(true)} // تمرير true إذا تم إرسال الطلب بنجاح
      />
    )}

    {openMessageDialog && (
      <MessageDialog 
        requestId={selectedRequestId} 
        onClose={handleCloseDialogs} 
      />
    )}

    {openTrackingDialog && (
      <TrackingDialog 
        requestId={selectedRequestId} 
        onClose={handleCloseDialogs}
        currentStatus={selectedStatus} // تمرير الحالة المختارة 
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
