import React, { useState } from "react";
import "./DistributorGoods.css";
import { useNavigate, useParams } from "react-router-dom";
import upload_image from "../../images/upload_image.png";
import Loader from "../../../Utils/Loader";
import { notification } from "antd";
import ConfirmationDialog from "../../Dialog/ConfirmationDialog";
import {
  createGoods,
  uploadGoodsImage,
} from "../../../api/manageDistributorGoodsAPI";

const AddDistributorsGoods = () => {
  const { userId } = useParams(); // Access userId from URL parameters
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    description: "",
    storageInfo: "",
    price: 0,
    image: null,
    goodsOption: [
      {
        optionName: "", // For example, "Color"
        menuList: [],
        currentMenuValue: "", // Temporary storage for the current menu value
      },
    ],
    units: [],
    currentUnit: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // max file size to be uploaded set to 1 mb.

  const navigate = useNavigate();

  // Handle file change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        notification.error({
          message: "Invalid File Type",
          description: "Only JPEG, JPG, and PNG are allowed.",
          placement: "top",
        });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        notification.error({
          message: "File Size Exceeded",
          description: "File size should be less than 1 MB.",
          placement: "top",
        });
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddMenuValue = (index) => {
    const updatedOptions = [...formData.goodsOption];
    const option = updatedOptions[index];

    if (
      option.currentMenuValue &&
      !option.menuList.includes(option.currentMenuValue)
    ) {
      option.menuList.push(option.currentMenuValue);
      option.currentMenuValue = "";
      setFormData({ ...formData, goodsOption: updatedOptions });
    }
  };

  const handleMoreGoods = () => {
    setFormData((prev) => ({
      ...prev,
      goodsOption: [
        ...prev.goodsOption,
        {
          optionName: "",
          menuList: [],
          currentMenuValue: "",
        },
      ],
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.goodsOption];
    updatedOptions[index].optionName = value;
    setFormData({ ...formData, goodsOption: updatedOptions });
  };

  const handleCurrentMenuValueChange = (index, value) => {
    const updatedOptions = [...formData.goodsOption];
    updatedOptions[index].currentMenuValue = value;
    setFormData({ ...formData, goodsOption: updatedOptions });
  };

  const handleAddUnit = () => {
    if (
      formData.currentUnit &&
      !formData.units.includes(formData.currentUnit)
    ) {
      setFormData((prev) => ({
        ...prev,
        units: [...prev.units, formData.currentUnit],
        currentUnit: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = null;
      if (formData.image) {
        const response = await uploadGoodsImage(formData.image);
        photoUrl = response.data.data.secure_url;
      }
      const updatedFormData = {
        ...formData,
        image: photoUrl,
      };
      //units array can't be empty
      if (formData.units.length === 0) {
        notification.warning({
          message: "Add Value or Unit",
          placement: "top",
        });
        setLoading(false);
        return;
      }
      const response = await createGoods(updatedFormData);
      if (response.data.success) {
        setFormData({
          name: "",
          quantity: 1,
          description: "",
          storageInfo: "",
          price: 0,
          image: null,
          goodsOption: [
            {
              optionName: "",
              menuList: [],
              currentMenuValue: "",
            },
          ],
          units: [],
          currentUnit: "",
        });
        setIsModalOpen(true); // Show the confirmation dialog
      }
    } catch (error) {
      notification.error({
        message: "Error in creating goods",
        description: "Please try later.",
        placement: "top",
      });
      console.error("Error adding goods:", error);
    }
    setLoading(false);
  };

  const confirmRedirect = () => {
    navigate(`/viewDistributorsGoods/${userId}`);
    setIsModalOpen(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="RequestsTable">
        <div className="header-row">
          <div className="title">Add Goods</div>
        </div>

        <div className="container add-page">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Goods Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Goods Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Goods Description</label>
              <textarea
                name="description"
                value={formData.description}
                placeholder="Should be at least 10 characters"
                style={{ fontSize: "16px" }}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Storage Information</label>
              <input
                type="text"
                name="storageInfo"
                value={formData.storageInfo}
                onChange={(e) =>
                  setFormData({ ...formData, storageInfo: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </div>

            {/* Goods Options Section */}
            {formData.goodsOption.map((option, index) => (
              <div key={index} className="form-group">
                <label>
                  Goods Option {index + 1}
                  {/*show adding button only after the last goods option not in everyone*/}
                  {index === formData.goodsOption.length - 1 && (
                    <button
                      className="material-add-button"
                      type="button"
                      onClick={handleMoreGoods}
                      style={{
                        padding: "4px 8px",
                        marginLeft: "10px",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  value={option.optionName}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="e.g Color"
                />
                <br />
                <label>Specific Values for {option.optionName}</label>
                <input
                  type="text"
                  value={option.currentMenuValue}
                  onChange={(e) =>
                    handleCurrentMenuValueChange(index, e.target.value)
                  }
                  placeholder={`Add value for ${option.optionName} (e.g Black, Red)`}
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
                    <li key={valIndex}>{value}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Units Section */}
            <div className="form-group">
              <label>Units</label>
              <input
                type="text"
                value={formData.currentUnit}
                onChange={(e) =>
                  setFormData({ ...formData, currentUnit: e.target.value })
                }
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
                {formData.units.map((unit, index) => (
                  <li key={index}>{unit}</li>
                ))}
              </ul>
            </div>
            <div className="form-group">
              <p className="form-upload-text">
                Image types allowed: jpeg, jpg, png
              </p>
              <p className="form-upload-text">
                Image size shouldn't exceed 1 mb
              </p>
              <label htmlFor="file-input">
                <img
                  src={imagePreview ? imagePreview : upload_image}
                  alt="Goods preview"
                  className="form-rawmaterial-thumbnail-img"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="file-input"
                  hidden
                />
              </label>
            </div>
            <div className="button-container">
              <button type="submit" className="submit-button">
                Save
              </button>
            </div>
          </form>
        </div>
        {isModalOpen && (
          <ConfirmationDialog
            title={<>{"Goods are added"}</>}
            message="Do you want to see added goods on the view page?"
            onConfirm={confirmRedirect}
            onCancel={() => setIsModalOpen(false)}
            stepType="viewOrder"
          />
        )}
      </div>
    </>
  );
};

export default AddDistributorsGoods;
