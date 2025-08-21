// src/app/features/nftSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collections: [],
  nfts: {},
  selectedCollectionId: null,
  activeNFT: null,
  loading: false,
  error: null,
  pagination: {
    collections: { currentPage: 1, totalPages: 1 },
    nfts: { currentPage: 1, totalPages: 1 }
  }
};

const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    addCollection: (state, action) => {
      state.collections.push(action.payload);
    },
    setNFTs: (state, action) => {
      const { collectionId, nfts } = action.payload;
      state.nfts[collectionId] = nfts;
    },
    addNFT: (state, action) => {
      const { collectionId, nft } = action.payload;
      if (!state.nfts[collectionId]) {
        state.nfts[collectionId] = [];
      }
      state.nfts[collectionId].push(nft);
    },
    setSelectedCollectionId: (state, action) => {
      state.selectedCollectionId = action.payload;
    },
    setActiveNFT: (state, action) => {
      state.activeNFT = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCollectionsPagination: (state, action) => {
      state.pagination.collections = { ...state.pagination.collections, ...action.payload };
    },
    setNFTsPagination: (state, action) => {
      state.pagination.nfts = { ...state.pagination.nfts, ...action.payload };
    },
  },
});

export const {
  setCollections,
  addCollection,
  setNFTs,
  addNFT,
  setSelectedCollectionId,
  setActiveNFT,
  setLoading,
  setError,
  clearError,
  setCollectionsPagination,
  setNFTsPagination
} = nftSlice.actions;

export default nftSlice.reducer;