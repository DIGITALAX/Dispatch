import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaginatedState {
  paginated: any;
  paginatedTimeline: any;
}

const initialPaginatedState: PaginatedState = {
  paginated: {},
  paginatedTimeline: {},
};

export const paginatedSlice = createSlice({
  name: "paginated",
  initialState: initialPaginatedState,
  reducers: {
    setPaginated: (
      state: PaginatedState,
      { payload: { actionPaginated, actionPaginatedTimeline } }
    ) => {
      state.paginated = actionPaginated;
      state.paginatedTimeline = actionPaginatedTimeline;
    },
  },
});

export const { setPaginated } = paginatedSlice.actions;

export default paginatedSlice.reducer;
