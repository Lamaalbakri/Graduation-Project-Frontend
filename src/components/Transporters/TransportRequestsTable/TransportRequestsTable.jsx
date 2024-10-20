import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ConfirmationDialog from "../../Dialog/ConfirmationDialog";
import {
  updateTransportRequestStatus,
  moveTransportRequestCurrentToPrevious,
} from "../../../api/transportRequestsAPI";
import { DataGrid } from "@mui/x-data-grid";
import "./TransportRequestsTable.css";

function TransportRequestsTable({ data }) {
  const [requests, setRequests] = useState(
    data.map((request) => ({
      ...request,
      statusClass: `status-${request.status}`,
    }))
  );

  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setRequests(data);
  }, [data]);

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value, requestId = null, status = "") => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
    if (requestId) setSelectedRequestId(requestId);
    if (status) setSelectedStatus(status);
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      //update in DB, get the request info after update
      const updatedTransportRequest = await updateTransportRequestStatus(
        id,
        newStatus
      );
      //update in front-end
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.shortId === id
            ? {
                ...request,
                status: updatedTransportRequest.data.status,
                statusClass: `status-${newStatus}`,
              }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "delivered" || newStatus === "rejected") {
      toggleDialog("confirmationDialog", true, id, newStatus);
    } else {
      updateRequestStatus(id, newStatus);
    }
  };

  const handleConfirmAction = async () => {
    try {
      //update in DB
      await updateRequestStatus(selectedRequestId, selectedStatus);
      //Move current transport request to previous request table in DB
      moveTransportRequestCurrentToPrevious(selectedRequestId);
      //remove current transport request from table in front-end
      setRequests((prevRequests) =>
        //filter keeps undelivered or not rejected requests
        prevRequests.filter((request) => request.shortId !== selectedRequestId)
      );
    } catch (error) {
      console.error("Error during confirmation action:", error);
    } finally {
      toggleDialog("confirmationDialog", false);
    }
  };

  if (!requests.length) {
    return (
      <div className="background-message">No transport requests found</div>
    );
  }

  const columns = [
    {
      field: "shortId",
      headerName: "ID",
      width: 120,
      headerAlign: "left",
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: "transportServiceName",
      headerName: "Transport Service",
      width: 170,
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
      width: 170,
      headerAlign: "left",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 70,
      headerAlign: "left",
    },
    {
      field: "deliveryDateRange",
      headerName: "Delivery Date Range",
      width: 170,
      headerAlign: "left",
      renderCell: (params) =>
        moment(params.row.deliveryDateRange).format("YYYY-MM-DD"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      headerAlign: "left",
      renderCell: (params) => {
        const statusClass = `status-${params.row.status}`;
        if (
          params.row.status === "rejected" ||
          params.row.status === "delivered"
        ) {
          return (
            <div className={`status-text ${statusClass}`}>
              {params.row.status}
            </div>
          );
        }
        return (
          <select
            value={params.row.status}
            className={`status-select ${statusClass}`}
            onChange={(e) =>
              handleStatusChange(params.row.shortId, e.target.value)
            }
          >
            <option value="pending">Pending</option>
            <option value="inProgress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
    {
      field: "arrivalCity",
      headerName: "Arrival City",
      width: 110,
      headerAlign: "left",
    },
    {
      field: "departureCity",
      headerName: "Departure City",
      width: 130,
      headerAlign: "left",
    },
  ];

  return (
    <div className="TransportRequestsTable">
      <DataGrid
        rows={requests}
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        columns={columns}
        getRowId={(row) => row.shortId}
        autoHeight
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10]}
        sx={{
          "& .MuiDataGrid-cell": { textAlign: "left" },
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "10px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
      />
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`Confirm ${
            selectedStatus === "rejected" ? "Rejection" : "Delivery"
          }`}
          message={`Are you sure you want to ${
            selectedStatus === "rejected" ? "reject" : "mark as delivered"
          } this transport request?`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
        />
      )}
    </div>
  );
}

TransportRequestsTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TransportRequestsTable;
