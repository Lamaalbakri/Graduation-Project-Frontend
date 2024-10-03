import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AssignTransporter from '../AssignTransporter/AssignTransporter';
import MessageDialog from '../Dialog/MessageDialog';
import TrackingDialog from '../Dialog/TrackingDialog';
import ConfirmationDialog from '../Dialog/ConfirmationDialog';
import { updateRawMaterialRequestStatus, moveCurrentToPrevious } from '../../api/rawMaterialRequestAPI';
import { MessageOutlined } from '@ant-design/icons';
import { DataGrid } from '@mui/x-data-grid';
import "./RequestsTable.css";

// The RequestsTable component receives and displays a list of data such as previous and current requests.
function RequestsTable({ data }) {

  //Prepare the state for each request individually.
  const [requests, setRequests] = useState(data.map(request => ({
    ...request,//A new object is created containing all the properties in the request.
    statusClass: `status-${request.status}`,//Add a new property to the object, statusClass to style the drop-down list status.
  })));

  // Unified state to manage all dialogs
  const [dialogState, setDialogState] = useState({
    assignTransporterDialog: false,
    messageDialog: false,
    trackingDialog: false,
    confirmationDialog: false,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setRequests(data); // Update requests when data changes
  }, [data]);

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value, requestId = null, status = "") => {
    setDialogState(prev => ({ ...prev, [dialogName]: value }));
    if (requestId) setSelectedRequestId(requestId);
    if (status) setSelectedStatus(status);
  };

  // Unified method to update request status
  const updateRequestStatus = async (id, newStatus) => {
    try {
      //update in DB, get the request info after update
      const updatedRequest = await updateRawMaterialRequestStatus(id, newStatus);
      //update in front-end
      setRequests(prevRequests =>
        prevRequests.map(request =>// Check each request in the list; update if shortId matches, else keep unchanged.
          request.shortId === id//Check if the shortId of the request matches the ID we want to update.
            ? { ...request, status: updatedRequest.data.status, statusClass: `status-${updatedRequest.data.status}` }
            : request//Returns the request as is if the condition is false.
        )
      );
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };

  // Handle status change from drop-down list (open dialog or update directly)
  const handleStatusChange = (id, newStatus) => {
    switch (newStatus) {
      case "accepted":
        toggleDialog("assignTransporterDialog", true, id);
        break;
      case "rejected":
      case "delivered":
        toggleDialog("confirmationDialog", true, id, newStatus);
        break;
      default:
        updateRequestStatus(id, newStatus);
    }
  };

  // Handle confirmation for delete or reject, called after clicking confirm in the dialog "onConfirm()"
  const handleConfirmAction = async () => {
    try {
      //update in DB
      await updateRequestStatus(selectedRequestId, selectedStatus);
      //Move current request to previous request table in DB
      moveCurrentToPrevious(selectedRequestId);
      //remove current request from table in front-end
      setRequests(prevRequests =>
        //filter keeps undelivered or not rejected requests
        prevRequests.filter(request => request.shortId !== selectedRequestId)
      );
    } catch (error) {
      console.error("Error during confirmation action:", error);
    } finally {
      // set state of dialog to false "close" 
      toggleDialog("confirmationDialog", false);
    }
  };

  // Handle "AssignTransporter" dialog close and updating request if necessary
  const handleDialogClose = async (wasRequestSent) => {
    // set state of dialog to false "close" 
    toggleDialog("assignTransporterDialog", false);
    //If the transport request is sent successfully, the status updates to "accepted".
    if (wasRequestSent) {
      updateRequestStatus(selectedRequestId, "accepted");
    }
  };

  //If there are no requests in DB, the message is displayed.
  if (!requests.length) {
    return <div className='background-message'>No results found</div>;
  }

  // Define columns for the DataGrid
  const columns = [
    { field: 'shortId', headerName: 'ID', width: 120, headerAlign: 'left', renderCell: (params) => `#${params.value}` },
    { field: 'manufacturerName', headerName: 'Manufacturer Name', width: 200, headerAlign: 'left' },
    {
      field: 'createdAt', headerName: 'Request Date', width: 140, headerAlign: 'left',
      renderCell: (params) => moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'supplyingItems', headerName: 'Supplying Items', width: 170, headerAlign: 'left',
      renderCell: (params) => (
        <div className="cell-content">
          {params.row.supplyingItems.map((item, index) => (
            <div key={index} className={`supplying-item ${index !== params.row.supplyingItems.length - 1 ? 'item-with-border' : ''}`}>
              {item}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: 'quantity', headerName: 'Quantity', type: 'number', width: 90, headerAlign: 'left',
      renderCell: (params) => (
        <div className="cell-content">
          {params.row.quantity.map((item, index) => (
            <div key={index} className={`supplying-item ${index !== params.row.quantity.length - 1 ? 'item-with-border' : ''}`}>
              {item}
            </div>
          ))}
        </div>
      ),
    },
    { field: 'price', headerName: 'Price', type: 'number', width: 70, headerAlign: 'left' },
    {
      field: 'status', headerName: 'Status', width: 130, headerAlign: 'left',
      renderCell: (params) => {
        const statusClass = `status-${params.row.status}`;
        if (params.row.status === 'rejected' || params.row.status === 'delivered') {
          return <div className={`status-text ${statusClass}`}>{params.row.status}</div>;
        }
        return (
          <select
            value={params.row.status}
            className={`status-select ${statusClass}`}
            onChange={(e) => handleStatusChange(params.row.shortId, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="inProgress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
    { field: 'arrivalCity', headerName: 'Arrival city', width: 140, headerAlign: 'left' },
    {
      field: 'action', headerName: 'Action', width: 140, headerAlign: 'left',
      renderCell: (params) => (
        <div className="action-buttons">
          <MessageOutlined className='table-icon message-icon' onClick={() => toggleDialog("messageDialog", true, params.row.shortId)} />
          <button className='tracking-icon' onClick={() => toggleDialog("trackingDialog", true, params.row.shortId, params.row.status)}></button>
        </div>
      ),
    },
  ];

  return (
    <div className='RequestsTable'>
      <DataGrid
        rows={requests}
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        columns={columns}
        getRowId={(row) => row.shortId}
        autoHeight
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[5, 10]}
        sx={{
          '& .MuiDataGrid-cell': { textAlign: 'left' },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        }}
      />
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`Confirm ${selectedStatus === "rejected" ? "Rejection" : "Delivery"}`}
          message={`Are you sure you want to ${selectedStatus === "rejected" ? "reject" : "mark as delivered"} this request?`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
        />
      )}
      {dialogState.assignTransporterDialog && (
        <AssignTransporter
          requestId={selectedRequestId}
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
        />
      )}
      {dialogState.messageDialog && (
        <MessageDialog
          requestId={selectedRequestId}
          onClose={() => toggleDialog("messageDialog", false)}
        />
      )}
      {dialogState.trackingDialog && (
        <TrackingDialog
          requestId={selectedRequestId}
          onClose={() => toggleDialog("trackingDialog", false)}
          currentStatus={selectedStatus}
        />
      )}
    </div>
  );
}

RequestsTable.propTypes = {
  data: PropTypes.array.isRequired,// Ensures that Prop 'data' is an array and is required to be provided.
};

export default RequestsTable;
