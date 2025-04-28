import axios from 'axios'

export const currentUser = async (token) => await axios.post('http://localhost:5001/api/current-user', {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
