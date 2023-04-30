import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import lensProfileReducer from "./reducers/lensProfileSlice";
import authStatusReducer from "./reducers/authStatusSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import pageReducer from "./reducers/pageSlice";
import dropSwitcherReducer from "./reducers/dropSwitcherSlice";
import tokenGatedSwitcherReducer from "./reducers/tokenGatedSwitcherSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import channelsReducer from "./reducers/channelsSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";

const reducer = combineReducers({
  lensProfileReducer,
  authStatusReducer,
  isCreatorReducer,
  pageReducer,
  dropSwitcherReducer,
  tokenGatedSwitcherReducer,
  mainVideoReducer,
  channelsReducer,
  reactIdReducer,
  indexModalReducer,
  dispatcherReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
