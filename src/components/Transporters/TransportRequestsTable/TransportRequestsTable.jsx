/*import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import ConfirmationDialog from "../Dialog/ConfirmationDialog";
import moment from "moment";
import { updateTransportRequestStatus } from "../api/transportRequestAPI";

function TransportRequestsTable({ data }) {
  const [requests, setData] = useState(() =>
    data.map((request) => ({
      ...request,
      statusClass: `status-${request.status}`,
    }))
  );
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setData(data);
  }, [data]);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "delivered" || newStatus === "rejected") {
      handleOpenConfirmationDialog(id, newStatus);
      return;
    }

    try {
      const updatedRequest = await updateTransportRequestStatus(id, newStatus);
      setData((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: updatedRequest.data.status,
                statusClass: `status-${updatedRequest.data.status}`,
              }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleOpenConfirmationDialog = (id, status) => {
    setSelectedRequestId(id);
    setSelectedStatus(status);
    setOpenConfirmationDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      const updatedRequest = await updateTransportRequestStatus(
        selectedRequestId,
        selectedStatus
      );
      setData((prevRequests) =>
        prevRequests.map((request) =>
          request._id === selectedRequestId
            ? {
                ...request,
                status: updatedRequest.data.status,
                statusClass: `status-${updatedRequest.data.status}`,
              }
            : request
        )
      );
      setOpenConfirmationDialog(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setSelectedRequestId(null);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 70, headerAlign: "left" },
    {
      field: "transportServiceName",
      headerName: "Transport Service Name",
      width: 200,
      headerAlign: "left",
    },
    {
      field: "weightCategory",
      headerName: "Weight Category",
      width: 150,
      headerAlign: "left",
    },
    {
      field: "distanceCategory",
      headerName: "Distance Category",
      width: 150,
      headerAlign: "left",
    },
    {
      field: "price",
      headerName: "Price",
      width: 90,
      headerAlign: "left",
      type: "number",
    },
    {
      field: "deliveryDateRange",
      headerName: "Delivery Date Range",
      width: 200,
      headerAlign: "left",
      renderCell: (params) => {
        return `${moment(params.row.startDate).format("YYYY-MM-DD")} - ${moment(
          params.row.endDate
        ).format("YYYY-MM-DD")}`;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "left",
      renderCell: (params) => {
        const statusClass = `status-${params.row.status}`;
        return (
          <select
            value={params.row.status}
            onChange={(e) => handleStatusChange(params.row._id, e.target.value)}
            className={`status-select ${statusClass}`}
          >
            <option value="pending" className="status-pending">
              Pending
            </option>
            <option value="inProgress" className="status-inProgress">
              In Progress
            </option>
            <option value="delivered" className="status-delivered">
              Delivered
            </option>
            <option value="rejected" className="status-rejected">
              Rejected
            </option>
          </select>
        );
      },
    },
    {
      field: "arrivalCity",
      headerName: "Arrival City",
      width: 150,
      headerAlign: "left",
    },
    {
      field: "departureCity",
      headerName: "Departure City",
      width: 150,
      headerAlign: "left",
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="RequestsTable">
      <DataGrid
        rows={requests}
        columns={columns}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row._id}
        autoHeight
        initialState={{ pagination: { paginationModel } }}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": { textAlign: "left" },
        }}
      />
      {openConfirmationDialog && (
        <ConfirmationDialog
          title={`Confirm ${
            selectedStatus === "rejected" ? "Rejection" : "Delivery"
          }`}
          message={`Are you sure you want to ${
            selectedStatus === "rejected" ? "reject" : "mark as delivered"
          } this transport request?`}
          onConfirm={handleConfirmAction}
          onCancel={handleCloseConfirmationDialog}
        />
      )}
    </div>
  );
}

TransportRequestsTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TransportRequestsTable; */
