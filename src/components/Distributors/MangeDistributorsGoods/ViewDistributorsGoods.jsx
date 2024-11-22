import React, { useState, useEffect } from "react";
import "./DistributorGoods.css";
import Loader from "../../../Utils/Loader";
import { Modal, notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  deleteGoods,
  getGoods,
  updateGoods,
  uploadGoodsImage,
} from "../../../api/manageDistributorGoodsAPI";

const ViewDistributorsGoods = () => {
  const [Goods, setGoods] = useState([]);
  const [filteredGoods, setFilteredGoods] = useState([]);
  const [query, setQuery] = useState("");
  const [currentGoods, setCurrentGoods] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchGoods = async () => {
    setLoading(true);
    try {
      const response = await getGoods();
      setGoods(response.data.data);
      setFilteredGoods(response.data.data);
    } catch (error) {
      console.error("Error fetching goods:", error);
      notification.error({
        message: "Error fetching goods",
        description: "Please try again later.",
        placement: "top",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoods();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter materials based on the query
    if (value) {
      const filtered = Goods.filter(
        (goods) =>
          goods.name.toLowerCase().includes(value.toLowerCase()) ||
          (goods.shortId !== undefined &&
            goods.shortId.toString().includes(value))
      );
      setFilteredGoods(filtered);
    } else {
      setFilteredGoods(Goods); // Reset to all materials if the query is empty
    }
  };

  const handleUpdate = (goods) => {
    setCurrentGoods(goods);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (goods) => {
    setCurrentGoods(goods);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (updatedGoods) => {
    setLoading(true);
    const response = await updateGoods(updatedGoods);
    fetchGoods();
    setLoading(false);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteGoods(currentGoods);
      if (response.data.success) {
        notification.success({
          message: "Successfully Deleted",
          description: "Goods has been Deleted",
          placement: "top",
        });
        fetchGoods(); // Refresh the materials list
      } else {
        console.log("Error deleting goods", response);
      }
    } catch (error) {
      notification.error({
        message: "Error deleting goods",
        description: "Please try again later.",
        placement: "top",
      });
      console.error("Error deleting goods:", error);
    }

    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="RequestsTable">
        <div className="header-row">
          <div className="title">View Goods</div>
          <div className="search-container">
            <label className="search-label">Search by Name / ID</label>
            <input
              type="search"
              placeholder="Search by Name / ID"
              value={query}
              onChange={handleSearchChange}
              className="input-with-icon"
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="materials-list">
          {filteredGoods.length > 0 ? (
            filteredGoods.map((goods) => (
              <div key={goods._id} className="material-card">
                <div className="image-section">
                  <img
                    src={goods.image}
                    alt={goods.name}
                    className="material-image"
                  />
                </div>
                <div className="info-section">
                  <h3>
                    <span className="material-id">#{goods.Id}</span>{" "}
                    {goods.name}
                  </h3>
                  <p>Quantity: {goods.quantity}</p>
                  <p>
                    Price: <span>{goods.price.toFixed(2)} SAR</span>
                  </p>
                  <p>{goods.description}</p>
                  {/* Access goodsOption and map through it */}
                  {goods.goodsOption?.map((option, index) => (
                    <p key={index}>
                      {option.optionName}: {option.menuList.join(", ")}
                    </p>
                  ))}
                  <p>Units: {goods.units.join(", ")}</p>
                  <div className="button-container">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(goods.shortId)}
                    >
                      Delete
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleUpdate(goods)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>
              No goods were found for your search.
            </p>
          )}
        </div>

        {isUpdateModalOpen && (
          <UpdateModal
            goods={currentGoods}
            onSave={handleSave}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            onConfirm={confirmDelete}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

// DeleteModal Component
const DeleteModal = ({ onConfirm, onClose }) => {
  return (
    <Modal
      title={
        <div
          style={{ display: "flex", alignItems: "center", fontSize: "18px" }}
        >
          <CloseCircleOutlined
            style={{ color: "red", marginRight: 8, fontSize: "30px" }}
          />
          <span>Confirm Deletion</span>
        </div>
      }
      visible={true}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Yes, Delete"
      cancelText="Cancel"
      okButtonProps={{
        style: {
          backgroundColor: "#1c2229",
          color: "#fff",
          border: "none",
        },
        className: "yes-delete-button",
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: "transparent",
          color: "#1c2229",
          border: "1px solid #1c2229",
        },
        className: "cancel-material-button",
      }}
    >
      <p>Are you sure you want to delete this goods?</p>
    </Modal>
  );
};

// UpdateModal Component
const UpdateModal = ({ goods, onSave, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [price, setPrice] = useState(0);
  const [goodsOption, setGoodsOption] = useState([]);
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState("");
  const [currentMenuValues, setCurrentMenuValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  useEffect(() => {
    if (goods) {
      setName(goods.name);
      setDescription(goods.description);
      setQuantity(goods.quantity);
      setPrice(goods.price);
      setPreviewImage(goods.image);
      setGoodsOption(goods.goodsOption || []);
      setUnits(goods.units || []);
      setCurrentMenuValues(
        goods.goodsOption ? goods.goodsOption.map(() => "") : []
      );
    }
  }, [goods]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type) || file.size > MAX_FILE_SIZE) {
        notification.error({
          message:
            file.size > MAX_FILE_SIZE
              ? "File Size Exceeded"
              : "Invalid File Type",
          description: "Only JPEG, JPG, and PNG under 1 MB are allowed.",
          placement: "top",
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuValue = (index) => {
    const updatedOptions = [...goodsOption];
    if (
      currentMenuValues[index] &&
      !updatedOptions[index].menuList.includes(currentMenuValues[index])
    ) {
      updatedOptions[index].menuList.push(currentMenuValues[index]);
      const updatedMenuValues = [...currentMenuValues];
      updatedMenuValues[index] = "";
      setCurrentMenuValues(updatedMenuValues);
      setGoodsOption(updatedOptions);
    }
  };
  const handleDeleteMenuValue = (optionIndex, valueIndex) => {
    const updatedOptions = [...goodsOption];
    updatedOptions[optionIndex].menuList.splice(valueIndex, 1);
    setGoodsOption(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...goodsOption];
    updatedOptions[index].optionName = value;
    setGoodsOption(updatedOptions);
  };

  const handleAddUnit = () => {
    if (currentUnit && !units.includes(currentUnit)) {
      setUnits((prevUnits) => [...prevUnits, currentUnit]);
      setCurrentUnit("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = previewImage;
      if (image) {
        const response = await uploadGoodsImage(image);
        if (response.data.success) imageUrl = response.data.data.secure_url;
      }
      const updatedGoods = {
        ...goods,
        name,
        description,
        quantity,
        price,
        image: imageUrl,
        goodsOption,
        units,
      };
      await onSave(updatedGoods);
      notification.success({
        message: "Goods Updated Successfully!",
        description: "The goods has been Updated.",
        placement: "top",
      });
      onClose(); // Close the modal after saving
    } catch (error) {
      notification.error({
        message: "Error updating material",
        description: "Please try again later.",
        placement: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = (index) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    setUnits(updatedUnits);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="modal add-page">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <h2>Update Goods</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
                min="0"
                step="0.01"
              />
            </div>

            {goodsOption.map((option, index) => (
              <div key={index} className="form-group">
                <label>Goods Option {index + 1}:</label>
                <input
                  type="text"
                  value={option.optionName}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="e.g., Color"
                  required
                />
                <input
                  type="text"
                  value={currentMenuValues[index]}
                  onChange={(e) => {
                    const updatedValues = [...currentMenuValues];
                    updatedValues[index] = e.target.value;
                    setCurrentMenuValues(updatedValues);
                  }}
                  placeholder={`Add value for ${option.optionName}`}
                />
                <button
                  className="material-add-button"
                  type="button"
                  onClick={() => handleAddMenuValue(index)}
                >
                  Add Value
                </button>
                <ul>
                  {option.menuList.map((value, valIndex) => (
                    <li key={valIndex}>
                      {value}
                      <button
                        type="button"
                        onClick={() => handleDeleteMenuValue(index, valIndex)}
                        style={{
                          marginLeft: "10px",
                          marginBottom: "10px",
                          marginTop: "10px",
                          color: "red",
                          cursor: "pointer",
                          backgroundColor: "#c3c3c3",
                          padding: "0px 5px",
                        }}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="form-group">
              <label>Units:</label>
              <input
                type="text"
                value={currentUnit}
                onChange={(e) => setCurrentUnit(e.target.value)}
                placeholder="Add Unit"
              />
              <button
                className="material-add-button"
                type="button"
                onClick={handleAddUnit}
              >
                Add Unit
              </button>
              <ul>
                {units.map((unit, index) => (
                  <li key={index}>
                    {unit}
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(index)}
                      style={{
                        marginLeft: "10px",
                        marginBottom: "10px",
                        marginTop: "10px",
                        color: "red",
                        cursor: "pointer",
                        backgroundColor: "#c3c3c3",
                        padding: "0px 5px",
                      }}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label>Image:</label>
              <div className="image-upload-container">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="material-image"
                  />
                )}
                <button
                  className="submit-button"
                  type="button"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  Choose File
                </button>
                <input
                  type="file"
                  id="file-input"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ViewDistributorsGoods;
