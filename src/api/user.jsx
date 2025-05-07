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

export const updateUserProfile = async (token, updatedData) => {
  const res = await axios.put('http://localhost:5001/api/update-info', updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
};

export const submitRequest = async (token, requestData) => {
  const res = await axios.post('http://localhost:5001/api/submit-request', requestData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
}

export const cancelRequest = async (token, requestId) => {
  const res = await axios.put(`http://localhost:5001/api/cancelRequest/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return res.data;
}