import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import lensProfileReducer from "./reducers/lensProfileSlice";
import authStatusReducer from "./reducers/authStatusSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import pageReducer from "./reducers/pageSlice";
import dropSwitcherReducer from "./reducers/dropSwitcherSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import channelsReducer from "./reducers/channelsSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import dropDetailsReducer from "./reducers/dropDetailsSlice";
import allDropsReducer from "./reducers/allDropsSlice";
import collectionSwitcherReducer from "./reducers/collectionSwitcherSlice";
import allCollectionsReducer from "./reducers/allCollectionsSlice";
import collectionDetailsReducer from "./reducers/collectionDetailsSlice";
import modalReducer from "./reducers/modalSlice";
import successModalReducer from "./reducers/successModalSlice";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import lookAroundReducer from "./reducers/lookAroundSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import seekSecondReducer from "./reducers/seekSecondSlice";
import reactionCountReducer from "./reducers/reactionCountSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import feedReducer from "./reducers/feedSlice";
import followerOnlyReducer from "./reducers/followerOnlySlice";
import purchaseReducer from "./reducers/purchaseSlice";
import postCollectReducer from "./reducers/postCollectSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import reactionFeedCountReducer from "./reducers/reactionFeedCountSlice";
import timelineReducer from "./reducers/timelineSlice";
import reactionTimelineCountReducer from "./reducers/reactionTimelineCountSlice";
import lastFeedIndexReducer from "./reducers/lastFeedIndexSlice";
import feedSwitchReducer from "./reducers/feedSwitchSlice";
import feedReactIdReducer from "./reducers/feedReactIdSlice";
import salesReducer from "./reducers/salesSlice";
import feedTypeReducer from "./reducers/feedTypeSlice";
import commentCountReducer from "./reducers/commentCountSlice";
import canCommentReducer from "./reducers/canCommentSlice";
import postImageReducer from "./reducers/postImageSlice";
import collectOpenReducer from "./reducers/collectOpenSlice";
import collectValueTypeReducer from "./reducers/collectValueTypeSlice";
import openCommentReducer from "./reducers/openCommentSlice";
import commentsReducer from "./reducers/commentsSlice";
import paginatedReducer from "./reducers/paginatedSlice";
import scrollPosReducer from "./reducers/scrollPosSlice";
import individualFeedCountReducer from "./reducers/individualFeedCountSlice";
import postGatedImageReducer from "./reducers/postGatedImageSlice";
import canEditCollectionReducer from "./reducers/canEditCollectionSlice";
import updateCollectionReducer from "./reducers/updateCollectionSlice";
import decryptReducer from "./reducers/decryptSlice";
import decryptCollectionsAllReducer from "./reducers/decryptCollectionsAllSlice";
import marketProfileReducer from "./reducers/marketProfileSlice";

const reducer = combineReducers({
  lensProfileReducer,
  authStatusReducer,
  isCreatorReducer,
  pageReducer,
  dropSwitcherReducer,
  mainVideoReducer,
  channelsReducer,
  reactIdReducer,
  indexModalReducer,
  dispatcherReducer,
  dropDetailsReducer,
  allDropsReducer,
  collectionSwitcherReducer,
  allCollectionsReducer,
  collectionDetailsReducer,
  modalReducer,
  successModalReducer,
  fullScreenVideoReducer,
  lookAroundReducer,
  videoSyncReducer,
  seekSecondReducer,
  reactionCountReducer,
  imageViewerReducer,
  reactionStateReducer,
  feedReducer,
  followerOnlyReducer,
  purchaseReducer,
  postCollectReducer,
  approvalArgsReducer,
  reactionFeedCountReducer,
  timelineReducer,
  reactionTimelineCountReducer,
  lastFeedIndexReducer,
  feedSwitchReducer,
  feedReactIdReducer,
  salesReducer,
  feedTypeReducer,
  commentCountReducer,
  canCommentReducer,
  postImageReducer,
  collectOpenReducer,
  collectValueTypeReducer,
  openCommentReducer,
  commentsReducer,
  paginatedReducer,
  scrollPosReducer,
  individualFeedCountReducer,
  postGatedImageReducer,
  canEditCollectionReducer,
  updateCollectionReducer,
  decryptReducer,
  decryptCollectionsAllReducer,
  marketProfileReducer
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
