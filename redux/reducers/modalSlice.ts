import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  open: boolean;
  message: string;
}

const initialModalState: ModalState = {
  open: false,
  message: "",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    setModal: (
      state: ModalState,
      { payload: { actionOpen, actionMessage } }
    ) => {
      state.open = actionOpen;
      state.message = actionMessage;
    },
  },
});

export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
