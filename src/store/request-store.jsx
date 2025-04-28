import { create } from 'zustand';
import axios from 'axios';
import { currentUser as fetchCurrentUser } from '../api/auth';
import { persist, createJSONStorage } from 'zustand/middleware';

const requestStore  = (set, get) => ({
    token: null,
    currentUser: null,
    loading: false,
    error: null,

    setToken: (newToken) => {
        set({ token: newToken });
    },

    clearToken: () => {
        set({ token: null });
    },

    setCurrentUser: (user) => {
        set({ currentUser: user });
    },

    clearCurrentUser: () => {
        set({ currentUser: null });
    },

    setLoading: (isLoading) => {
        set({ loading: isLoading });
    },

    setError: (err) => {
        set({ error: err });
    },

    actionLogin: async (no_card_id, phone, navigate) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5001/api/login", { no_card_id, phone });
            set({
                token: res.data.token,
                currentUser: res.data.payload,
                loading: false,
            });
            if (navigate) {
                navigate("/user"); // เปลี่ยนเป็น "/user" เพื่อไปที่ HomeUser ตาม routes
            }
            return res;
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            set({ loading: false, error: error.response ? error.response.data.message : "Login failed" });
            throw error;
        }
    },
    

    actionLogout: (navigate) => {
        set({ token: null, currentUser: null });
        if (navigate) {
            navigate("/login");
        }
    },

    fetchCurrentUser: async () => {
        set({ loading: true, error: null });
        const token = get().token;
        if (!token) {
            set({ loading: false });
            return;
        }
        try {
            const res = await fetchCurrentUser(token);
            set({ currentUser: res.data.currentUser, loading: false });
        } catch (error) {
            console.error("Failed to fetch current user:", error.response ? error.response.data : error.message);
            set({ token: null, currentUser: null, loading: false, error: error.response ? error.response.data.message : "Failed to fetch user info" });
            // Optionally redirect to login
            // if (navigate) {
            //     navigate('/login');
            // }
        }
    },
    fetchUserProfile: async () => {
        set({ loading: true, error: null });
        const token = get().token;
        if (!token) {
          set({ loading: false });
          return;
        }
        try {
          const res = await getUserProfile(token);
          set({ currentUser: res.data, loading: false });
        } catch (error) {
          console.error("Failed to fetch user profile:", error.response ? error.response.data : error.message);
          set({
            token: null,
            currentUser: null,
            loading: false,
            error: error.response ? error.response.data.message : "Failed to fetch user profile"
          });
        }
      },
    

})

const usePersist = {
    name: "request-store",
    storage: createJSONStorage(() => localStorage),
};

const useRequestStore = create(persist(requestStore, usePersist));

export default useRequestStore;