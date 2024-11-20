const API_URL = 'http://localhost:8500/api/v1';
import axios from 'axios';

export const fetchAllGoodsCurrentRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/manageGoodsManufacturer/getManufacturerGoods`, {
        withCredentials: true,
      });
      return response.data.data; 
    } catch (error) {
      throw new Error(`Error: ${error.response?.status}`);
    }
};
  
export const fetchGoodsForListOfManufacturer = async () => {
    try {
      const response = await axios.get(`${API_URL}/manageGoodsManufacturer/getSpecificManufacturerGoodsList`, {
        withCredentials: true,
      });
      return response.data.data; 
    } catch (error) {
      throw new Error(`Error: ${error.response?.status}`);
    }
};
  
export const uploadGoodsImage = async (image) => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", image);
    const response = await axios.post(`${API_URL}/manageGoodsManufacturer/image-uploads`, uploadFormData);
    if (!response.data.success) {
      console.error(error);
    }
    return response;
}; 
  
// create goods
export const createGoods = async (updatedFormData) => {
    const response = await axios.post(`${API_URL}/manageGoodsManufacturer/createManufacturerGoods`, updatedFormData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    return response;
};
  
// get goods
export const getGoods = async () => {
    const response = await axios.get(`${API_URL}/manageGoodsManufacturer/getManufacturerGoods`,
      { withCredentials: true });
    return response;
}
  
// update goods
export const updateGoods = async (updatedGoods) => {
    const response = await axios.post(`${API_URL}/manageGoodsManufacturer/updateManufacturerGoods`, updatedGoods,
      { withCredentials: true });
    return response;
}
  
// delete goods
export const deleteGoods = async (shortId) => {
    const response = await axios.post(`${API_URL}/manageGoodsManufacturer/deleteManufacturerGoods`, { data: { shortId } },
      { withCredentials: true });
    return response;
};