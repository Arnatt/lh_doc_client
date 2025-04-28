import axios from 'axios';

export const getUserProfile = async (token) => {
  return await axios.get('http://localhost:5001/api/user-info', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
