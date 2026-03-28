import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createAdityaBirla,
    getAllAdityaBirla,
    getAdityaBirlaById,
    updateAdityaBirla,
} from "../../../../api-services/AdityaBirla/adityaBirlaApi.js";

// CREATE
export const createAditya = createAsyncThunk(
    "aditya/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await createAdityaBirla(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// GET ALL
export const fetchAllAditya = createAsyncThunk(
    "aditya/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllAdityaBirla();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// GET BY ID
export const fetchAdityaById = createAsyncThunk(
    "aditya/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getAdityaBirlaById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// UPDATE
export const updateAdityaDetails = createAsyncThunk(
    "aditya/update",
    async ({ id, ...data }, thunkAPI) => {
        try {
            const res = await updateAdityaBirla(id, data);
            return res.updated;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
);