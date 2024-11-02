const API_URL = 'http://localhost:8500/api/v1';

// fetch transportation companies
export const fetchCompanies = async () => {
    const response = await fetch(`${API_URL}/transportRequests`, {
        method: 'GET',
        credentials: 'include'
    });
      
    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch company list: ${response.status} ${errorDetails}`);
    }
    const json = await response.json();
    return json.data; //return all data
};

export const sendTransportRequest = async (requestData) => {
    try {
      const response = await fetch(`${API_URL}/transportRequest`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send request.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending transport request:", error);
      throw error;
    }
};

// get request 
export const fetchAllCurrentTransportRequests = async () => {
    const response = await fetch(`${API_URL}/transportCurrentRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};
export const fetchAllPreviousTransportRequests = async () => {
    const response = await fetch(`${API_URL}/transportPreviousRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};

// change status
export const updateTransportRequestStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }) // إرسال الحالة الجديدة
        });

        if (!response.ok) {
            throw new Error('Failed to update the status');
        }

        return await response.json(); // استلام الرد
    } catch (error) {
        console.error("Error updating the status:", error);
        throw error; // إعادة الخطأ ليتسنى التعامل معه في مكان آخر
    }
};

// delete
export const deleteTransportCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Error deleting current request: ${response.status}`);
    }
    // إذا كانت الاستجابة 204، فلا تحاول قراءة JSON

    if (response.status !== 204) {
        const data = await response.json(); // فقط حاول قراءة JSON إذا لم تكن الاستجابة 204
        return data; // استلام الرد بعد الحذف
    }

    return { msg: 'Request deleted successfully' }; // رد مناسب عند الحذف بنجاح بدون محتوى
};

// search current by id
export const searchTransportCurrentRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/transportCurrentRequest/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch current request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

// search previous by id
export const searchTransportPreviousRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/transportPreviousRequest/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch previous request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

// move currnt request to preveious request
export const moveTransportRequestCurrentToPrevious = async (id) => {

    try {
        // الخطوة الثانية: جلب الطلب من الطلبات الحالية
        const currentRequest = await searchTransportCurrentRequestById(id);

        // الخطوة الثالثة: إرسال الطلب إلى قائمة الطلبات السابقة
        const response = await fetch(`${API_URL}/transportPreviousRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentRequest) // إرسال الطلب كما هو
        });

        if (!response.ok) {
            throw new Error(`Error moving request to previous: ${response.status}`);
        }

        // الخطوة الرابعة: حذف الطلب من قائمة الطلبات الحالية (اختياري إذا كان نقل وليس نسخ)
        await deleteTransportCurrentRequestById(id);

        return await response.json(); // إرجاع الرد
    } catch (error) {
        console.error("Error moving request to previous:", error);
        throw error; // إعادة الخطأ ليتسنى التعامل معه في مكان آخر
    }
};