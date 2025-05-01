import axios from "axios";


export const getAllRequests = async (token) => {
  try {
    const response = await axios.get('http://localhost:5001/api/requests', { // <--- ตรวจสอบ '/requests' หรือ endpoint ที่ถูกต้อง
      headers: {
        Authorization: `Bearer ${token}`, // ถ้ามีการใช้ Authentication
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRequestById = async (token, id) => {
  return await axios.get(`http://localhost:5001/api/requests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRequest = async (token, id, payload) => {
  return await axios.put(`http://localhost:5001/api/requests/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
