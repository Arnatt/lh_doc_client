import { create } from 'zustand';
import axios from 'axios';
import { currentUser as fetchCurrentUser } from '../api/auth';
import { getAllRequests } from '../api/admin'; // <--- Import getAllRequests
import { persist, createJSONStorage } from 'zustand/middleware';
import { getUserRequests, getUserProfile, updateUserProfile } from '../api/user';

const requestStore = (set, get) => ({
    token: null,
    currentUser: null,
    currentAdmin: null,
    loading: false,
    error: null,
    isAdmin: false,
    allRequests: [], // กำหนดค่าเริ่มต้นเป็น array ว่างเปล่า
    loadingRequests: false,
    errorRequests: null,
    requestInfo: {},

    setToken: (newToken) => {set({ token: newToken })},

    clearToken: () => {set({ token: null })},

    setCurrentUser: (user) => {set({ currentUser: user })},

    clearCurrentUser: () => {set({ currentUser: null })},

    setCurrentAdmin: (admin) => {set({ currentAdmin: admin })},

    clearCurrentAdmin: () => {set({ currentAdmin: null })},

    setLoading: (isLoading) => {set({ loading: isLoading })},

    setError: (err) => { set({ error: err }) },

    setIsAdmin: (isAdmin) => { set({ isAdmin }) },

    setRequestInfo: (info) => set({ requestInfo: info }),

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
                navigate("/user");
            }
            return res;
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            set({ loading: false, error: error.response ? error.response.data.message : "Login failed" });
            throw error;
        }
    },

    actionLoginAdmin: async (username, password, navigate) => {
        set({ loading: true, error: null, isAdmin: false, currentUser: null }); // รีเซ็ต isAdmin และ currentUser
        try {
            const res = await axios.post("http://localhost:5001/api/login-admin", { username, password });
            set({
                token: res.data.token,
                currentAdmin: res.data.payload,
                loading: false,
                isAdmin: true,
            });
            if (navigate) {
                navigate("/admin");
            }
            get().fetchCurrentAdmin();
            return res;
        } catch (error) {
            console.error("Admin login failed:", error.response ? error.response.data : error.message);
            set({ loading: false, error: error.response ? error.response.data.message : "Admin login failed" });
            throw error;
        }
    },

    actionLogout: (navigate) => {
        set({ token: null, currentUser: null, currentAdmin: null, isAdmin: false }); // รีเซ็ต currentAdmin ด้วย
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
        }
    },

    fetchCurrentAdmin: async () => {
        set({ loading: true, error: null });
        const token = get().token;
        if (!token) {
            set({ loading: false });
            return;
        }

        try {
            console.log("fetchCurrentAdmin: Calling API (POST) - http://localhost:5001/api/current-admin");
            const res = await axios.post("http://localhost:5001/api/current-admin", {}, { // Changed axios.get to axios.post and added an empty body {}
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status >= 200 && res.status < 300) {
                set({ currentAdmin: res.data.currentAdmin, loading: false, isAdmin: true });
            } else {
                console.error("fetchCurrentAdmin: API returned an error status:", res.status);
                set({ error: `Failed to fetch admin profile (Status: ${res.status})`, loading: false, isAdmin: false, currentAdmin: null, token: null });
                localStorage.removeItem('token');
            }

        } catch (error) {
            console.error("fetchCurrentAdmin: Error during API call:", error);
            set({ error: `Failed to fetch admin profile: ${error.message}`, loading: false, isAdmin: false, currentAdmin: null, token: null });
            localStorage.removeItem('token');
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
            set({ currentUser: res.data, loading: false, currentAdmin: null, isAdmin: false });
        } catch (error) {
            console.error("Failed to fetch user profile:", error.response ? error.response.data : error.message);
            set({
                token: null,
                currentUser: null,
                currentAdmin: null,
                isAdmin: false,
                loading: false,
                error: error.response ? error.response.data.message : "Failed to fetch user profile"
            });
        }
    },

    setAllRequests: (requests) => set({ allRequests: requests }),
    setLoadingRequests: (loadingRequests) => set({ loadingRequests }),
    setErrorRequests: (errorRequests) => set({ errorRequests }),

    fetchAllRequests: async () => {
        set({ loadingRequests: true, errorRequests: null });
        const token = get().token;
        try {
            const res = await getAllRequests(token); // <--- เรียกใช้ getAllRequests ที่ import มา
            set({ allRequests: res.data.data || [], loadingRequests: false }); // ตรวจสอบว่า res.data.data มีค่า
        } catch (error) {
            console.error("Failed to fetch all requests:", error);
            set({ errorRequests: error.message || "Failed to fetch all requests", loadingRequests: false, allRequests: [] }); // ตั้งค่า allRequests เป็น [] ในกรณี error
        }
    },

    fetchUserRequests: async (token, count = 10) => {
        set({ loadingRequests: true, errorRequests: null });
        try {
            const res = await getUserRequests(token, count);
            set({ allRequests: res.data || [], loadingRequests: false });
        } catch (error) {
            console.error('Fetch user requests error:', error);
            set({
                errorRequests: error.response?.data?.message || 'Error fetching requests',
                loadingRequests: false,
                allRequests: [],
            });
        }
    },

    updateUserProfile: async (updatedData) => {
        const token = get().token;
        if (!token) return;
        set({ loading: true, error: null });
        try {
            await updateUserProfile(token, updatedData);
            set({ loading: false });
        } catch (error) {
            console.error("Failed to update user profile:", error);
            set({
                error: error.response?.data?.message || "Update failed",
                loading: false
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