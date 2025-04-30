import axios from 'axios';

export const getUserProfile = async (token) => {
  return await axios.get('http://localhost:5001/api/user-info', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getUserRequests = async (token, count = 10) => {
  const res = await axios.get(`http://localhost:5001/api/user/requests/${count}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};