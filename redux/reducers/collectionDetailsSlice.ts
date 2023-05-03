import { createSlice } from "@reduxjs/toolkit";

export interface CollectionDetailsState {
  title: string;
  description: string;
  image: string;
  amount: number;
  acceptedTokens: string[];
  tokenPrices: number[];
  disabled: boolean;
}

const initialCollectionDetailsState: CollectionDetailsState = {
  title: "Collection Title",
  description: "Collection Description :)",
  image: "",
  amount: 1,
  acceptedTokens: [],
  tokenPrices: [],
  disabled: false,
};

export const collectionDetailsSlice = createSlice({
  name: "collectionDetails",
  initialState: initialCollectionDetailsState,
  reducers: {
    setCollectionDetails: (
      state: CollectionDetailsState,
      {
        payload: {
          actionTitle,
          actionDescription,
          actionImage,
          actionAmount,
          actionAcceptedTokens,
          actionTokenPrices,
          actionDisabled,
        },
      }
    ) => {
      state.title = actionTitle;
      state.description = actionDescription;
      state.image = actionImage;
      state.amount = actionAmount;
      state.acceptedTokens = actionAcceptedTokens;
      state.tokenPrices = actionTokenPrices;
      state.disabled = actionDisabled;
    },
  },
});

export const { setCollectionDetails } = collectionDetailsSlice.actions;

export default collectionDetailsSlice.reducer;
