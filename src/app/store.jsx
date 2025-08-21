import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './features/campaignSlice';
import nftReducer from "./features/nft/nftSlice";

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    nft: nftReducer,
  },
});
