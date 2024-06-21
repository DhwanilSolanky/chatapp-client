import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for login
const adminLogin = createAsyncThunk(
    'admin/login',
    async (secretKey) => {
        try {
            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': "application/json",
                },
            }
            const { data } = await axios.post('http://localhost:3000/api/v1/admin/verify', { secretKey }, config);
            return data.message;
        } catch (error) {
            throw error.response.data.message;
        }
    }
);

const getAdmin = createAsyncThunk(
    'admin/getAdmin',
    async (secretKey) => {
        try {
            const config = {
                withCredentials: true,
            }
            const { data } = await axios.get('http://localhost:3000/api/v1/admin/', config);
            return data.admin;
        } catch (error) {
            throw error.response.data.message;
        }
    }
);

const adminLogout = createAsyncThunk(
    'admin/adminLogout',
    async (secretKey) => {
        try {
            debugger;
            const config = {
                withCredentials: true,
            }
            const { data } = await axios.get('http://localhost:3000/api/v1/admin/logout', config);
            return data.message;
        } catch (error) {
            throw error.response.data.message;
        }
    }
);

export {
    adminLogin,
    getAdmin,
    adminLogout
};