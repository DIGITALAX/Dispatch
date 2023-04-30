import { Profile } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LensProfileState {
  profile?: Profile | undefined;
}

const initialLensProfileState: LensProfileState = {
  profile: undefined,
};

export const lensProfileSlice = createSlice({
  name: "lensProfile",
  initialState: initialLensProfileState,
  reducers: {
    setLensProfile: (
      state: LensProfileState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setLensProfile } = lensProfileSlice.actions;

export default lensProfileSlice.reducer;
