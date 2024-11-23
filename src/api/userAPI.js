const API_URL = 'http://localhost:8500/api/v1';

// Fetch user data
export const fetchUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/login/getMe`, {
      method: "GET",
      credentials: 'include', // Sending cookies with orders
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    console.log(data);
    console.log(data.data);
    return data.data; // Returns user data
  } catch (error) {
    throw error;
  }
};

export const fetchUserDataWithSupplier = async () => {
  try {
    const response = await fetch(`${API_URL}/login/getMeWithSuppliers`, {
      method: "GET",
      credentials: 'include', // Sending cookies with orders
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    console.log(data);
    console.log(data.data);
    return data.data; // Returns user data
  } catch (error) {
    throw error;
  }
};

export const fetchUserDataWithManufacturer = async () => {
  try {
    const response = await fetch(`${API_URL}/login/getMeWithManufacturers`, {
      method: "GET",
      credentials: 'include', // Sending cookies with orders
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    console.log(data);
    console.log(data.data);
    return data.data; // Returns user data
  } catch (error) {
    throw error;
  }
};

export const fetchUserDataWithDistributor = async () => {
  try {
    const response = await fetch(`${API_URL}/login/getMeWithDistributors`, {
      method: "GET",
      credentials: 'include', // Sending cookies with orders
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    console.log(data);
    console.log(data.data);
    return data.data; // Returns user data
  } catch (error) {
    throw error;
  }
};

// Update user data
export const updateUserData = async (userData, userType) => {
  try {
    const response = await fetch(`${API_URL}/user/update/${userData.id}?userType=${userType}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user data.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};