import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Skeleton
} from '@mui/material';
import CampaignCard from '../app/features/CampaignCard'; // Adjusted import path to match your structure
import CollectionsIcon from '@mui/icons-material/Collections';

const NFTGrid = ({ nfts, onMintClick, isLoading = false }) => {

  // Loading State: Show skeletons while data is being fetched
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Skeleton 
              variant="rectangular" 
              sx={{ 
                width: '100%', 
                height: 300, 
                borderRadius: '12px' 
              }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Empty State: Show if no NFTs are available
  if (!nfts || nfts.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          marginTop: 8,
          marginBottom: 8,
          color: '#fff' // White text
        }}
      >
        <CollectionsIcon sx={{ fontSize: 60, color: '#FF7A18', mb: 2 }} /> {/* Orange icon */}
        <Typography variant="h6" gutterBottom sx={{ color: '#FF7A18', fontWeight: 'bold' }}>
          No NFTs Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
          You don't own any NFTs in this collection. Mint your first one to get started!
        </Typography>
        <Button
          variant="contained"
          onClick={onMintClick} // Execute function passed from parent
          sx={{
            mt: 2,
            background: 'linear-gradient(90deg, #FF7A18, #AF002D)',
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
              boxShadow: '0px 4px 15px rgba(255, 122, 24, 0.5)'
            }
          }}
        >
          Mint NFT
        </Button>
      </Box>
    );
  }

  // Default State: Show grid of NFTs
  return (
    <Grid container spacing={3}>
      {nfts.map(nft => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={nft.id}>
          <CampaignCard nft={nft} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NFTGrid;