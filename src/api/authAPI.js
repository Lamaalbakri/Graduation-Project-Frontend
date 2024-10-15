const API_URL = 'http://localhost:8500/api/v1';


//login 
export const loginUser = async (email, password, userType) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, userType }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed. Please try again.");
        }

        return data;  // success, return the data
    } catch (error) {
        throw error;  // re-throw the error to handle it in the component
    }
};


//Register

export const registerUser = async (full_name, email, phone_number, password, confirm_password, userType) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name,
                email,
                phone_number,
                password,
                confirm_password,
                userType
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            //console.error("Error response:", errorData);
            throw new Error("Error registering user: " + errorData);
        }

        const data = await response.json();  // success, return the data
        return data;  //Return data to Front-End
    } catch (error) {
        throw error;  // re-throw the error to handle it in the component
    }
};
