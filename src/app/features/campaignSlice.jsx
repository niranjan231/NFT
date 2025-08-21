// src/app/features/campaignSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  campaigns: [],
  currentCampaign: null,
  draftCampaign: null,
  loading: false,
  error: null
};

const calculateStatus = (auctionEndTime) => {
  if (!auctionEndTime) return 'Draft';
  const now = new Date();
  const endTime = new Date(auctionEndTime);
  return endTime < now ? 'Ended' : 'Active';
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    startNewCampaign: (state) => {
      state.draftCampaign = {
        id: uuidv4(),
        category: '',
        description: '',
        tokenName: '',
        tokenSymbol: '',
        fundDesired: 0,
        totalTokens: 0,
        perTokenPrice: 0,
        resellType: 'percentage',
        resellValue: 10,
        auctionEndTime: null,
        auctionDuration: null,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        ownerId: 'user-1' // Replace with actual user ID logic
      };
    },
    updateDraftCampaign: (state, action) => {
      if (state.draftCampaign) {
        state.draftCampaign = { ...state.draftCampaign, ...action.payload };
      }
    },
    clearDraft: (state) => {
      state.draftCampaign = null;
    },
    addCampaign: (state, action) => {
      const newCampaign = {
        ...action.payload,
        status: calculateStatus(action.payload.auctionEndTime),
        id: action.payload.id || uuidv4(),
      };
      state.campaigns.push(newCampaign);
      state.currentCampaign = newCampaign;
      state.draftCampaign = null;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setCurrentCampaign: (state, action) => {
      state.currentCampaign = action.payload;
      if (action.payload && action.payload.auctionEndTime) {
        state.currentCampaign.status = calculateStatus(action.payload.auctionEndTime);
      }
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        const updatedCampaign = {
          ...action.payload,
          status: calculateStatus(action.payload.auctionEndTime)
        };
        state.campaigns[index] = updatedCampaign;
        if (state.currentCampaign?.id === updatedCampaign.id) {
          state.currentCampaign = updatedCampaign;
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  startNewCampaign,
  updateDraftCampaign,
  clearDraft,
  addCampaign,
  setCampaigns,
  setCurrentCampaign,
  updateCampaign,
  setLoading,
  setError
} = campaignSlice.actions;

export default campaignSlice.reducer;