import { createSlice } from "@reduxjs/toolkit";

export interface SuccessModalState {
  open: boolean;
  media: string;
  link: string;
  message: string;
  type: string;
}

const initialSuccessModalState: SuccessModalState = {
  open: false,
  media: "",
  link: "",
  message: "",
  type: "",
};

export const successModalSlice = createSlice({
  name: "successModal",
  initialState: initialSuccessModalState,
  reducers: {
    setSuccessModal: (
      state: SuccessModalState,
      {
        payload: {
          actionOpen,
          actionMedia,
          actionLink,
          actionMessage,
          actionType,
        },
      }
    ) => {
      state.open = actionOpen;
      state.media = actionMedia;
      state.link = actionLink;
      state.message = actionMessage;
      state.type = actionType;
    },
  },
});

export const { setSuccessModal } = successModalSlice.actions;

export default successModalSlice.reducer;
