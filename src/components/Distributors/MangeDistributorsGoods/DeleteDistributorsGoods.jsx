import React, { useState, useEffect } from "react";
import "./DistributorGoods.css";
import Loader from "../../../Utils/Loader";
import { Modal, notification } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { getGoods, deleteGoods } from "../../../api/manageDistributorGoodsAPI";

const DeleteDistributorsGoods = () => {
  const [Goods, setGoods] = useState([]);
  const [filteredGoods, setFilteredGoods] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoods, setCurrentGoods] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    fetchGoods();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = Goods.filter(
        (goods) =>
          goods.name.toLowerCase().includes(value.toLowerCase()) ||
          (goods.shortId !== undefined &&
            goods.shortId.toString().includes(value))
      );
      setFilteredGoods(filtered);
    } else {
      setFilteredGoods(Goods);
    }
  };

  const handleDelete = (goods) => {
    setCurrentGoods(goods);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteGoods(currentGoods);
      if (response.data.success) {
        notification.success({
          message: "Successfully Deleted ",
          description: "Goods has been Deleted",
          placement: "top",
        });
        setFilteredGoods((prevGoods) =>
          prevGoods.filter((goods) => goods.shortId !== currentGoods)
        );
      } else {
        notification.error({
          message: "Error deleting goods",
          description: "Failed to delete goods. Please try again later.",
          placement: "top",
        });
      }
    } catch (error) {
      console.error("Error deleting goods:", error);
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="RequestsTable">
        <div className="header-row">
          <div className="title">Delete Goods</div>
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
        <div className={`search-instruction ${query ? "hidden" : "visible"}`}>
          <p>Search for the item you want to Delete</p>
        </div>
        {query && (
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
                    <div className="button-container">
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(goods.shortId)}
                      >
                        Delete
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
        )}

        <Modal
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
              }}
            >
              <CloseCircleOutlined
                style={{ color: "red", marginRight: 8, fontSize: "30px" }}
              />
              <span>Confirm Deletion</span>
            </div>
          }
          visible={isModalOpen}
          onOk={confirmDelete}
          onCancel={() => setIsModalOpen(false)}
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
      </div>
    </>
  );
};

export default DeleteDistributorsGoods;
