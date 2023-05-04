import { createSlice } from "@reduxjs/toolkit";

export interface DropDetailsState {
  title: string;
  image: string;
  collectionIds: number[];
  disabled: boolean;
  id?: number;
}

const initialDropDetailsState: DropDetailsState = {
  title: "Drop Title",
  image: "",
  collectionIds: [],
  disabled: false,
  id: undefined,
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
          actionId,
        },
      }
    ) => {
      state.title = actionTitle;
      state.image = actionImage;
      state.collectionIds = actionCollectionIds;
      state.disabled = actionDisabled;
      state.id = actionId;
    },
  },
});

export const { setDropDetails } = dropDetailsSlice.actions;

export default dropDetailsSlice.reducer;
