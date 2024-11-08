const API_URL = 'http://localhost:8500/api/v1';
import axios from 'axios';

export const fetchAllCurrentRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/manageRawMaterial/get-materials`, {
      withCredentials: true,
    });
    return response.data.data; // إعادة جميع البيانات
  } catch (error) {
    throw new Error(`Error: ${error.response?.status}`);
  }
};


export const fetchMaterialForListOfSupplier = async () => {
  try {
    const response = await axios.get(`${API_URL}/manageRawMaterial/get-specific-material-list`, {
      withCredentials: true,
    });
    return response.data.data; // إعادة جميع البيانات
  } catch (error) {
    throw new Error(`Error: ${error.response?.status}`);
  }
};

export const uploadImage = async (image) => {
  const uploadFormData = new FormData();
  uploadFormData.append("image", image);
  const response = await axios.post(`${API_URL}/manageRawMaterial/image-uploads`, uploadFormData);
  if (!response.data.success) {
    console.error(error);
  }
  return response;
};


// create material
export const createMaterial = async (updatedFormData) => {
  const response = await axios.post(`${API_URL}/manageRawMaterial/create-materials`, updatedFormData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  return response;
};


// get material
export const getMaterial = async () => {
  const response = await axios.get(`${API_URL}/manageRawMaterial/get-materials`,
    { withCredentials: true });
  return response;
}

// update material
export const updateMaterial = async (updatedMaterial) => {
  const response = await axios.post(`${API_URL}/manageRawMaterial/update-material`, updatedMaterial,
    { withCredentials: true });
  return response;
}

// delete material
export const deleteMaterial = async (shortId) => {
  const response = await axios.post(`${API_URL}/manageRawMaterial/delete-material`, { data: { shortId } },
    { withCredentials: true });
  return response;
};