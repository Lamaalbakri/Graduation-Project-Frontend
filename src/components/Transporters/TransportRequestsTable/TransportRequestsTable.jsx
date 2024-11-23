import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ConfirmationDialog from "../../Dialog/ConfirmationDialog";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  updateTransportRequestStatus,
  moveTransportRequestCurrentToPrevious,
} from "../../../api/transportRequestsAPI";
import { DataGrid } from "@mui/x-data-grid";
import { Modal } from "antd";
import "./TransportRequestsTable.css";
import { createContract, updateContract } from "../../../api/smartContractAPI";

function TransportRequestsTable({ data }) {
  const [requests, setRequests] = useState(
    data.map((request) => ({
      ...request,
      statusClass: `TransportRequestsTable-status-${request.status}`,
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

  const handleViewContract = (id) => {
    window.open(`/SmartContract/${id}`, "_blank");
  };

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

      if (!updatedTransportRequest || updatedTransportRequest.error) {
        //throw new Error("Failed to update status in the backend");
        Modal.error({
          title: "Error:",
          content: `Failed to update sender, Call customer service.`,
          okButtonProps: {
            className: "confirm-buttonn",
          },
        });
      }

      //update in front-end
      setRequests((prevRequests) =>
        prevRequests.map(
          (
            request // Check each request in the list; update if shortId matches, else keep unchanged.
          ) =>
            request.shortId === id
              ? {
                  ...request,
                  status: updatedTransportRequest.data.status,
                  statusClass: `TransportRequestsTable-status-${updatedTransportRequest.data.status}`,
                }
              : request
        )
      );
    } catch (error) {
      Modal.error({
        title: "Error:",
        content: "Error updating the status, Call customer service.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    }
  };

  const handleStatusChange = async (
    transportOrderId,
    purchaseOrderId,
    newStatus
  ) => {
    try {
      if (newStatus === "accepted") {
        const createResponse = await createContract(
          transportOrderId,
          purchaseOrderId
        );
        if (createResponse.error) {
          throw new Error("Failed to create contract");
        }
        updateRequestStatus(transportOrderId, newStatus);
      } else if (newStatus === "delivered") {
        toggleDialog("confirmationDialog", true, transportOrderId, newStatus);
      } else if (newStatus === "rejected") {
        toggleDialog("confirmationDialog", true, transportOrderId, newStatus);
      } else {
        updateRequestStatus(transportOrderId, newStatus);
      }
    } catch (error) {
      Modal.error({
        title: "Error",
        content: `Error processing status change`,
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (selectedStatus === "delivered") {
        const updateResponse = await updateContract(selectedRequestId);
        if (updateResponse.error) {
          throw new Error("Failed to update contract");
        }
      }

      //update in DB
      await updateRequestStatus(selectedRequestId, selectedStatus);
      //Move current transport request to previous request table in DB
      moveTransportRequestCurrentToPrevious(selectedRequestId);
      //remove current transport request from table in front-end
      setRequests((prevRequests) =>
        //filter keeps undelivered or not rejected requests
        prevRequests.filter((request) => request.shortId !== selectedRequestId)
      );
      // moveCurrentToPrevious(purchaseOrderId);
    } catch (error) {
      Modal.error({
        title: "Error",
        content: `Error during confirmation action`,
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    } finally {
      toggleDialog("confirmationDialog", false);
    }
  };

  // if there are no requests in DB, the message is displayed.
  if (!requests.length) {
    return (
      <div className="TransportRequestsTable-background-message">
        No transport requests found
      </div>
    );
  }

  const columns = [
    {
      field: "shortId",
      headerName: "Transport Request ID",
      width: 110,
      headerAlign: "left",
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: "request_id",
      headerName: "Request ID",
      width: 120,
      headerAlign: "left",
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: "temperature",
      headerName: "Transport Service",
      width: 110,
      headerAlign: "left",
    },
    {
      field: "weight",
      headerName: "Weight Category",
      width: 110,
      headerAlign: "left",
    },
    {
      field: "distance",
      headerName: "Distance Category",
      width: 140,
      headerAlign: "left",
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      type: "number",
      width: 75,
      headerAlign: "left",
      renderCell: (params) => {
        const price = params.row.totalPrice;
        return (
          <div className="TransportRequestsTable-cell-content">
            {price !== undefined ? `${price} SAR` : "Price not available"}
          </div>
        );
      },
    },
    {
      field: "estimated_delivery_date",
      headerName: "Delivery Date Range",
      width: 130,
      headerAlign: "left",
      renderCell: (params) => {
        const dates = Array.isArray(params.row.estimated_delivery_date)
          ? params.row.estimated_delivery_date
          : [];
        const formattedDates = dates
          .map((date) => moment(date).format("YYYY-MM-DD"))
          .join(" to ");
        return (
          <div className="TransportRequestsTable-cell-content">
            {formattedDates}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      headerAlign: "left",
      renderCell: (params) => {
        const statusClass = `TransportRequestsTable-status-${params.row.status}`;
        const formattedStatus =
          params.row.status.charAt(0).toUpperCase() +
          params.row.status.slice(1);

        if (
          params.row.status === "rejected" ||
          params.row.status === "delivered"
        ) {
          return (
            <div
              className={`TransportRequestsTable-status-text-no-drop-${params.row.status}`}
            >
              {formattedStatus}
            </div>
          );
        }
        return (
          <select
            value={params.row.status}
            className={`TransportRequestsTable-status-select ${statusClass}`}
            onChange={(e) =>
              handleStatusChange(
                params.row.shortId,
                params.row.request_id,
                e.target.value
              )
            }
          >
            {params.row.status === "pending" && (
              <>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </>
            )}
            {params.row.status === "accepted" && (
              <>
                <option value="accepted">Accepted</option>
                <option value="delivered">Delivered</option>
              </>
            )}
          </select>
        );
      },
    },
    {
      field: "contract",
      headerName: "Contract",
      width: 110,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="TransportRequestsTable-contract-button">
          <button onClick={() => handleViewContract(params.row.shortId)}>
            View
          </button>
        </div>
      ),
    },
    {
      field: "arrivalAddress",
      headerName: "Arrival Address",
      width: 115,
      headerAlign: "left",
      renderCell: (params) => {
        const address = params.row.arrivalAddress;
        return (
          <div className="TransportRequestsTable-cell-content">
            {address
              ? `${address.street}, ${address.neighborhood}, ${address.city}, ${address.postal_code}, ${address.country}`
              : "No Address"}
          </div>
        );
      },
    },
    {
      field: "departureAddress",
      headerName: "Departure Address",
      width: 115,
      headerAlign: "left",
      renderCell: (params) => {
        const address = params.row.departureAddress;
        return (
          <div className="TransportRequestsTable-cell-content">
            {address
              ? `${address.street}, ${address.neighborhood}, ${address.city}, ${address.postal_code}, ${address.country}`
              : "No Address"}
          </div>
        );
      },
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
          "& .css-1qb993p-MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "1.2",
            overflow: "hidden",
            textOverflow: "clip",
            wordBreak: "keep-all",
            overflowWrap: "normal",
            wordWrap: "normal",
          },
        }}
      />
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={
            <>
              {selectedStatus === "rejected" ? (
                <CloseCircleOutlined
                  style={{
                    color: "red",
                    marginRight: 8,
                    fontSize: "35px",
                    position: "relative",
                    top: "6px",
                  }}
                />
              ) : (
                <CheckCircleOutlined
                  style={{
                    color: "green",
                    marginRight: 8,
                    fontSize: "35px",
                    position: "relative",
                    top: "6px",
                  }}
                />
              )}
              {`Confirm ${
                selectedStatus === "rejected" ? "Rejection" : "Delivery"
              }`}
            </>
          }
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
