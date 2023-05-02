import { createSlice } from "@reduxjs/toolkit";

export interface SuccessModalState {
  open: boolean;
  media: string;
  link: string;
  message: string;
}

const initialSuccessModalState: SuccessModalState = {
  open: false,
  media: "",
  link: "",
  message: "",
};

export const successModalSlice = createSlice({
  name: "successModal",
  initialState: initialSuccessModalState,
  reducers: {
    setSuccessModal: (
      state: SuccessModalState,
      { payload: { actionOpen, actionMedia, actionLink, actionMessage } }
    ) => {
      state.open = actionOpen;
      state.media = actionMedia;
      state.link = actionLink;
      state.message = actionMessage;
    },
  },
});

export const { setSuccessModal } = successModalSlice.actions;

export default successModalSlice.reducer;
