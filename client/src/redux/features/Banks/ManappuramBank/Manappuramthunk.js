import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createManappuram,
    getAllManappuram,
    getManappuramById,
    updateManappuram,
} from "../../../../api-services/Manappuramapi/Manappuramapi.js";

// CREATE
export const createManappuramReport = createAsyncThunk(
    "manappuram/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await createManappuram(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET ALL
export const fetchAllManappuram = createAsyncThunk(
    "manappuram/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllManappuram();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET BY ID
export const fetchManappuramById = createAsyncThunk(
    "manappuram/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getManappuramById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// UPDATE
export const updateManappuramDetails = createAsyncThunk(
    "manappuram/update",
    async ({ id, ...data }, thunkAPI) => {
        try {
            const res = await updateManappuram(id, data);
            return res.updated;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);