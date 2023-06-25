import { Profile } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MarketProfileState {
  profile?: Profile | undefined;
}

const initialMarketProfileState: MarketProfileState = {
  profile: undefined,
};

export const marketProfileSlice = createSlice({
  name: "marketProfile",
  initialState: initialMarketProfileState,
  reducers: {
    setMarketProfile: (
      state: MarketProfileState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setMarketProfile } = marketProfileSlice.actions;

export default marketProfileSlice.reducer;
