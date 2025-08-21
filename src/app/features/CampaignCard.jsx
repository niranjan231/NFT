import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Chip
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const CampaignCard = ({ nft, onViewClick, onContributeClick }) => {
  const [isFavorite, setIsFavorite] = useState(nft.isFavorite || false);
  // Example derived data - calculate time remaining if an auction is active
  const timeRemaining = "2d 14h 32m"; // This should be dynamically calculated based on nft.auctionEndTime

  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // Prevent triggering the card's main click event
    setIsFavorite(!isFavorite);
    // Here you would dispatch an action to update the NFT in the backend/Redux store
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
        color: '#fff',
        border: '1px solid',
        borderColor: '#FF7A18',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(255, 122, 24, 0.3)',
          '& .hover-actions': { // Show buttons on hover
            opacity: 1,
            bottom: 10
          }
        }
      }}
    >
      {/* Image Section with Overlay and Hover Actions */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={nft.image || '/placeholder-nft.jpg'}
          alt={nft.name}
          sx={{ 
            width: '100%', 
            objectFit: 'cover' 
          }}
        />
        {/* Favorite Button */}
        <IconButton
          size="small"
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: isFavorite ? '#FF7A18' : '#fff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Status Chip (e.g., Active, Ended) */}
        {nft.status && (
          <Chip
            label={nft.status}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: nft.status === 'Active' ? '#4CAF50' : '#f44336', // Green for Active, Red for Ended
              color: '#fff',
              fontWeight: 'bold'
            }}
          />
        )}

        {/* Hover Action Buttons */}
        <Box 
          className="hover-actions"
          sx={{
            position: 'absolute',
            bottom: -50, // Hidden by default
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            opacity: 0,
            transition: 'all 0.3s ease'
          }}
        >
          <Button 
            variant="contained" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onContributeClick && onContributeClick(nft);
            }}
            sx={{
              background: 'linear-gradient(90deg, #FF7A18, #AF002D)',
              borderRadius: '20px',
              px: 2,
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
              }
            }}
          >
            Contribute
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onViewClick && onViewClick(nft);
            }}
            sx={{
              color: '#fff',
              borderColor: '#FF7A18',
              borderRadius: '20px',
              px: 2,
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#FF9A52',
                backgroundColor: 'rgba(255, 122, 24, 0.1)'
              }
            }}
          >
            View
          </Button>
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: 2 }}>
        {/* NFT Name */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#FF7A18' }}>
          {nft.name}
        </Typography>

        {/* Collection Name */}
        <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
          {nft.collectionName}
        </Typography>

        {/* Auction Timer - Only show if campaign is active */}
        {(nft.status === 'Active' || nft.auctionEndTime) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: '#FF7A18', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#fff' }}>
              {timeRemaining}
            </Typography>
          </Box>
        )}

        {/* Price / Current Bid */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Price
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>
            {nft.price ? `${nft.price} ETH` : 'N/A'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;