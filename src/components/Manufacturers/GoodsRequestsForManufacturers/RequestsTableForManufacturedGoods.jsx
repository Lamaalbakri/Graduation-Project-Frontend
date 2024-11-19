import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import AssignTransporter from "../../AssignTransporter/AssignTransporter";
import TrackingDialog from "../../Dialog/TrackingDialog";
import ConfirmationDialog from "../../Dialog/ConfirmationDialog";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import {
  updateManufacturerGoodsRequestStatus,
  moveManufacturerGoodsCurrentToPrevious,
} from "../../../api/manufacturerGoodsRequestsAPI";
import { DataGrid } from "@mui/x-data-grid";
import "./RequestsTableForManufacturedGoods.css";

function RequestsTableForManufacturedGoods({ data }) {
  //Prepare the state for each request individually.
  const [requests, setRequests] = useState(
    data.map((request) => ({
      ...request, //A new object is created containing all the properties in the request.
      statusClass: `ManageGoodsManufacturers-status-${request.status}`, //Add a new property to the object, statusClass to style the drop-down list status.
      receiverId: request.distributorId,
      receiverType: request.receiverType || "distributor",
    }))
  );

  // Unified state to manage all dialogs
  const [dialogState, setDialogState] = useState({
    assignTransporterDialog: false,
    trackingDialog: false,
    confirmationDialog: false,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedArrivalAddress, setSelectedArrivalAddress] = useState(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [selectedReceiverType, setSelectedReceiverType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setRequests(data); // Update requests when data changes
  }, [data]);

  const handleViewContract = (id) => {
    window.open(`/SmartContract/${id}`, "_blank");
  };

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (
    dialogName,
    value,
    requestId = null,
    status = "",
    receiverId = null,
    receiverType = ""
  ) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
    if (requestId) setSelectedRequestId(requestId);
    if (status) setSelectedStatus(status);
    if (receiverId) setSelectedReceiverId(receiverId);
    if (receiverType) setSelectedReceiverType(receiverType);
  };

  // Unified method to update request status
  const updateRequestStatus = async (id, newStatus) => {
    try {
      //update in DB, get the request info after update
      const updatedRequest = await updateManufacturerGoodsRequestStatus(
        id,
        newStatus
      );

      if (!updatedRequest || updatedRequest.error) {
        throw new Error("Failed to update status in the backend");
      }
      //update in front-end
      setRequests((prevRequests) =>
        prevRequests.map(
          (
            request // Check each request in the list; update if shortId matches, else keep unchanged.
          ) =>
            request.shortId === id //Check if the shortId of the request matches the ID we want to update.
              ? {
                  ...request,
                  status: updatedRequest.data.status,
                  statusClass: `ManageGoodsManufacturers-status-${updatedRequest.data.status}`,
                }
              : request //Returns the request as is if the condition is false.
        )
      );
      return updatedRequest; // Return the updated request if needed
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Failed to update status. Please contact support.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
      return null; // Return null or an error object to indicate failure if needed
    }
  };

  // Handle status change from drop-down list (open dialog or update directly)
  const handleStatusChange = (id, newStatus) => {
    const request = requests.find((req) => req.shortId === id);
    const arrivalAddress = request ? request.arrivalAddress : null;
    const receiverId = request ? request.distributorId : null;
    const receiverType = request
      ? request.receiverType || "distributor"
      : "distributor";

    switch (newStatus) {
      case "accepted":
        if (arrivalAddress && receiverId && receiverType) {
          toggleDialog(
            "assignTransporterDialog",
            true,
            id,
            arrivalAddress,
            receiverId,
            receiverType
          );
          setSelectedArrivalAddress(arrivalAddress);
          setSelectedReceiverId(receiverId);
          setSelectedReceiverType(receiverType);
        } else {
          console.error(
            "Arrival address, receiverId, or receiverType is null for request ID:",
            id
          );
        }
        break;
      case "rejected":
        toggleDialog("confirmationDialog", true, id, newStatus);
        break;
      default:
        updateRequestStatus(id, newStatus);
    }
  };

  // Handle confirmation for delete or reject, called after clicking confirm in the dialog "onConfirm()"
  const handleConfirmAction = async () => {
    const previousStatus = requests.find(
      (request) => request.shortId === selectedRequestId
    )?.status;
    let errorMoveCurrentToPrevious = false;
    let errorUpdateStatus = false;
    try {
      //update state in back-end
      const statusUpdateResult = await updateRequestStatus(
        selectedRequestId,
        selectedStatus
      );

      if (!statusUpdateResult || statusUpdateResult.error) {
        errorUpdateStatus = true;
        throw new Error("Failed to update status in the backend");
      }

      //remove request from current table to previous
      const moveResult = await moveManufacturerGoodsCurrentToPrevious(
        selectedRequestId
      );

      if (moveResult.error || !moveResult) {
        errorMoveCurrentToPrevious = true;
        throw new Error("Move request to previous failed");
      }

      // Update frontend state to remove the request from the current list
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.shortId !== selectedRequestId)
      );

      Modal.success({
        //confirm
        title: "Rejected request",
        content:
          "The rejected request was moved to the previous requests page.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    } catch (error) {
      if (errorMoveCurrentToPrevious || errorUpdateStatus) {
        // Restore the original state of the request in the back-end
        await updateRequestStatus(selectedRequestId, previousStatus);
        Modal.error({
          title: "Error",
          content:
            "Failed to move request to previous. Please contact support.",
          okButtonProps: {
            className: "confirm-buttonn",
          },
        });
      }
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
    return (
      <div className="ManageGoodsManufacturers-background-message">
        No results found
      </div>
    );
  }

  // Define columns for the DataGrid
  const columns = [
    {
      field: "shortId",
      headerName: "ID",
      width: 120,
      headerAlign: "left",
      renderCell: (params) => `#${params.value}`,
    },
    {
      field: "distributorName",
      headerName: "Distributor Name",
      width: 150,
      headerAlign: "left",
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      width: 100,
      headerAlign: "left",
      renderCell: (params) =>
        moment(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      field: "goodsForDistributors",
      headerName: "Goods",
      width: 140,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="ManageGoodsManufacturers-cell-content">
          {params.row.goodsForDistributors.map((item, index) => (
            <div
              key={`${item.goods_id}-${index}`}
              className={`ManageGoodsManufacturers-goods-item ${
                index !== params.row.goodsForDistributors.length - 1
                  ? "item-with-border"
                  : ""
              }`}
            >
              {item.goods_name}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 80,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="ManageGoodsManufacturers-cell-content">
          {params.row.goodsForDistributors.map((item, index) => (
            <div
              key={`${item.goods_id}-${index}`}
              className="ManageGoodsManufacturers-goods-item"
            >
              {item.quantity} {item.unit}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: "options",
      headerName: "Options",
      width: 150,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="ManageGoodsManufacturers-cell-content">
          {params.row.goodsForDistributors.map((item, index) => (
            <div
              key={`${item.goods_id}-${index}`}
              className="ManageGoodsManufacturers-goods-item"
            >
              {item.options && item.options.length > 0 ? (
                // If options exist, display them
                item.options.map((option, optionIndex) => (
                  <span key={`${option.optionType}-${optionIndex}`}>
                    <strong>{option.optionType}:</strong>{" "}
                    {option.values.join(", ")} {/* Format name and values */}
                    {index < item.options.length - 1 && ", "}{" "}
                    {/* Add a comma between options */}
                  </span>
                ))
              ) : (
                // If no options, display "No option"
                <span>No option</span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: "total_price",
      headerName: "Total Price",
      type: "number",
      width: 80,
      headerAlign: "left",
      renderCell: (params) => {
        const price = params.row.total_price;
        return (
          <div className="ManageGoodsManufacturers-cell-content">
            {price !== undefined ? `${price} SAR` : "Price not available"}
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
        const statusClass = `ManageGoodsManufacturers-status-${params.row.status}`;
        const formattedStatus =
          params.row.status.charAt(0).toUpperCase() +
          params.row.status.slice(1);

        if (
          params.row.status === "rejected" ||
          params.row.status === "delivered" ||
          params.row.status === "inProgress" ||
          params.row.status === "accepted"
        ) {
          return (
            <div
              className={`ManageGoodsManufacturers-status-text-no-drop-${params.row.status}`}
            >
              {formattedStatus}
            </div>
          );
        }
        return (
          <select
            value={params.row.status}
            className={`ManageGoodsManufacturers-status-select ${statusClass}`}
            onChange={(e) =>
              handleStatusChange(params.row.shortId, e.target.value)
            }
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
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
        <div className="ManageGoodsManufacturers-contract-button">
          <button onClick={() => handleViewContract(params.row.shortId)}>
            View
          </button>
        </div>
      ),
    },
    {
      field: "arrivalAddress",
      headerName: "Arrival Address",
      width: 110,
      headerAlign: "left",
      renderCell: (params) => {
        const address = params.row.arrivalAddress;
        return (
          <div className="ManageGoodsManufacturers-cell-content">
            {address
              ? `${address.street}, ${address.neighborhood}, ${address.city}, ${address.postal_code}, ${address.country}`
              : "No Address"}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Tracking",
      width: 140,
      headerAlign: "left",
      renderCell: (params) => (
        <div className="ManageGoodsManufacturers-action-buttons">
          <button
            className="ManageGoodsManufacturers-tracking-icon"
            onClick={() =>
              toggleDialog(
                "trackingDialog",
                true,
                params.row.shortId,
                params.row.status
              )
            }
          ></button>
        </div>
      ),
    },
  ];

  return (
    <div className="ManageGoodsManufacturers">
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
          } this request?`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
          stepType={selectedStatus === "viewOrder" ? "viewOrder" : "default"}
        />
      )}
      {dialogState.assignTransporterDialog && (
        <AssignTransporter
          requestId={selectedRequestId}
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
          arrivalAddress={selectedArrivalAddress}
          receiverId={selectedReceiverId}
          receiverType={selectedReceiverType}
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

RequestsTableForManufacturedGoods.propTypes = {
  data: PropTypes.array.isRequired, // Ensures that Prop 'data' is an array and is required to be provided.
};

export default RequestsTableForManufacturedGoods;
