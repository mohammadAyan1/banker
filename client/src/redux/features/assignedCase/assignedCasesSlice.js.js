import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAssignedCases,
  fetchPendingCases,
  fetchTotalSubmitCase,
  getCancelledCases,
  getOutOfTatCases,
  fetchSummaryData,
} from "./assignedCasesThunk";

const assignedCasesSlice = createSlice({
  name: "assignedCases",
  initialState: {
    data: [],
    pendingCases: [],
    cancelledCases: [],
    final: [],
    outOfTatCases: [], // <-- add this
    summary: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch summary data
      .addCase(fetchSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummaryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch assigned cases
   
      // fetch pending cases
      .addCase(fetchAssignedCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignedCases.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAssignedCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPendingCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingCases.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCases = action.payload;
      })
      .addCase(fetchPendingCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // fetch total submit
      .addCase(fetchTotalSubmitCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalSubmitCase.fulfilled, (state, action) => {
        state.loading = false;
        state.final = action.payload;
      })
      .addCase(fetchTotalSubmitCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      //! get cancel cases
      .addCase(getCancelledCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCancelledCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledCases = action.payload;
      })
      .addCase(getCancelledCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Out of TAT
      .addCase(getOutOfTatCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOutOfTatCases.fulfilled, (state, action) => {
        state.loading = false;
        state.outOfTatCases = action.payload;
      })
      .addCase(getOutOfTatCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignedCasesSlice.reducer;
