import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../../config/axios";

export const fetchAssignedCases = createAsyncThunk(
  "cases/fetchAssigned",
  async () => {
    const res = await axios.get("/case/assigned");
    return res.data;
  }
);

export const fetchPendingCases = createAsyncThunk(
  "cases/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/pending"); // API endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch pending cases"
      );
    }
  }
);

export const fetchTotalSubmitCase = createAsyncThunk(
  "cases/FinalSubmittedCase",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/total-submit-data"); // API endpoint

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch pending cases"
      );
    }
  }
);

export const getCancelledCases = createAsyncThunk(
  "cases/getCancelledCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/cancelled");

      // console.log(response, "Data");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch cancelled cases"
      );
    }
  }
);

export const getOutOfTatCases = createAsyncThunk(
  "cases/getOutOfTatCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/out-of-tat");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch Out of TAT cases"
      );
    }
  }
);

export const fetchSummaryData = createAsyncThunk(
  "summary/fetchSummaryData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/summary-data");
      return response.data;
    } catch (error) {
      console.error("Error fetching summary data:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
