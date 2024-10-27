const API_URL = 'http://localhost:8500/api/v1';

// جلب بيانات المستخدم
export const fetchUserData = async () => {
    try {
        const response = await fetch(`${API_URL}/login/getMe`, {
            method: "GET",
            credentials: 'include', // إرسال الكوكيز مع الطلبات
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user data.");
        }
        console.log(data);
        console.log(data.data);
        return data.data; // إرجاع بيانات المستخدم
    } catch (error) {
        throw error; // إعادة رمي الخطأ للتعامل معه في المكون
    }
};
