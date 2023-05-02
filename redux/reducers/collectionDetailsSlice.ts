import { createSlice } from "@reduxjs/toolkit";

export interface CollectionDetailsState {
  title: string;
  description: string;
  image: string;
  amount: number;
  acceptedTokens: string[];
  tokenPrices: number[];
}

const initialCollectionDetailsState: CollectionDetailsState = {
  title: "",
  description: "",
  image: "",
  amount: 0,
  acceptedTokens: [],
  tokenPrices: [],
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
        },
      }
    ) => {
      state.title = actionTitle;
      state.description = actionDescription;
      state.image = actionImage;
      state.amount = actionAmount;
      state.acceptedTokens = actionAcceptedTokens;
      state.tokenPrices = actionTokenPrices;
    },
  },
});

export const { setCollectionDetails } = collectionDetailsSlice.actions;

export default collectionDetailsSlice.reducer;
