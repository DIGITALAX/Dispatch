import { createSlice } from "@reduxjs/toolkit";

export interface DropDetailsState {
  title: string;
  image: string;
  collectionIds: number[];
  disabled: boolean;
}

const initialDropDetailsState: DropDetailsState = {
  title: "Drop Title",
  image: "",
  collectionIds: [],
  disabled: false,
};

export const dropDetailsSlice = createSlice({
  name: "dropDetails",
  initialState: initialDropDetailsState,
  reducers: {
    setDropDetails: (
      state: DropDetailsState,
      {
        payload: {
          actionTitle,
          actionImage,
          actionCollectionIds,
          actionDisabled,
        },
      }
    ) => {
      state.title = actionTitle;
      state.image = actionImage;
      state.collectionIds = actionCollectionIds;
      state.disabled = actionDisabled;
    },
  },
});

export const { setDropDetails } = dropDetailsSlice.actions;

export default dropDetailsSlice.reducer;
