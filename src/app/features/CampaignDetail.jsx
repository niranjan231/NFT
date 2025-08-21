import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { useSelector } from 'react-redux';
import NFTGrid from '../../components/NFTGrid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CampaignDetail = ({ campaign, onContribute, onMintClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasEnded, setHasEnded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);

  // Safely get current user from Redux
  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    if (!campaign || !campaign.auctionEndTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(campaign.auctionEndTime).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setHasEnded(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      setHasEnded(false);
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Set initial time and start interval
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign]);

  // Filter user's NFTs from campaign NFTs
  useEffect(() => {
    if (campaign && campaign.nfts && currentUser) {
      const userNFTs = campaign.nfts.filter(nft => nft.ownerId === currentUser.id);
      setUserNFTs(userNFTs);
    }
  }, [campaign, currentUser]);

  if (!campaign) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6" sx={{ color: '#FF7A18' }}>Select a campaign to view details.</Typography>
      </Box>
    );
  }

  const isOwner = currentUser?.id && currentUser.id === campaign.ownerId;
  const hasUserNFTs = userNFTs.length > 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', my: 4, p: isMobile ? 1 : 3 }}>
      {/* User's NFT Card (if any) */}
      {hasUserNFTs && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(145deg, #2a1a1a, #3a2a2a)', color: '#fff', border: '2px solid #FF7A18' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: '#FF7A18', fontWeight: 'bold' }}>
              Your NFT
            </Typography>
            <Chip
              icon={<AccessTimeIcon />}
              label={hasEnded ? 'Auction Ended' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
              color={hasEnded ? 'error' : 'primary'}
              sx={{
                backgroundColor: hasEnded ? '#f44336' : 'linear-gradient(90deg, #FF7A18, #AF002D)',
                color: '#fff',
                fontWeight: 'bold',
                px: 2,
                py: 1
              }}
            />
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box 
                component="img" 
                src={userNFTs[0].image} 
                alt={userNFTs[0].name}
                sx={{ 
                  width: '100%', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 1 }}>{userNFTs[0].name}</Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                {userNFTs[0].description || 'No description available'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`Token ID: ${userNFTs[0].tokenId}`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
                <Chip label={`Edition: ${userNFTs[0].editionNumber}/${userNFTs[0].totalEditions}`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
              </Box>
              
              <Button
                variant="outlined"
                endIcon={<ExpandMoreIcon />}
                onClick={() => setShowDetails(true)}
                sx={{
                  color: '#FF7A18',
                  borderColor: '#FF7A18',
                  '&:hover': {
                    borderColor: '#FF9A52',
                    backgroundColor: 'rgba(255, 122, 24, 0.1)'
                  }
                }}
              >
                View Details
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Header Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', color: '#fff', border: '1px solid #FF7A18' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF7A18', mb: 1 }}>
              {campaign.tokenName} ({campaign.tokenSymbol})
            </Typography>
            <Chip
              label={campaign.category}
              variant="outlined"
              sx={{ color: '#FF7A18', borderColor: '#FF7A18', mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PersonIcon sx={{ color: '#FF7A18', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Created by: {campaign.ownerId || 'Unknown'}
                {isOwner && <Chip label="You" size="small" sx={{ ml: 1, backgroundColor: '#4CAF50', color: '#fff' }} />}
              </Typography>
            </Box>
          </Box>
          {!hasUserNFTs && (
            <Chip
              icon={<AccessTimeIcon />}
              label={hasEnded ? 'Auction Ended' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
              color={hasEnded ? 'error' : 'primary'}
              sx={{
                backgroundColor: hasEnded ? '#f44336' : 'linear-gradient(90deg, #FF7A18, #AF002D)',
                color: '#fff',
                fontWeight: 'bold',
                px: 2,
                py: 1
              }}
            />
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Description and Details */}
        <Grid item xs={12} md={8}>
          {/* Description Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', color: '#fff', border: '1px solid #FF7A18' }}>
            <Typography variant="h6" sx={{ color: '#FF7A18', mb: 2 }}>Description</Typography>
            <Typography variant="body1" paragraph sx={{ color: '#ccc', lineHeight: 1.6 }}>
              {campaign.description}
            </Typography>
          </Paper>

          {/* Token Details Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', color: '#fff', border: '1px solid #FF7A18' }}>
            <Typography variant="h6" sx={{ color: '#FF7A18', mb: 2 }}>Token Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Token Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>{campaign.tokenName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Token Symbol</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>{campaign.tokenSymbol}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Total Supply</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>{campaign.totalTokens.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Price per Token</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>{campaign.perTokenPrice} ETH</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Funding Goal</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>{campaign.fundDesired} ETH</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Auction & Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', color: '#fff', border: '1px solid #FF7A18' }}>
            <Typography variant="h6" sx={{ color: '#FF7A18', mb: 2 }}>Auction & Resale</Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#ccc' }}>Resell Royalty</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FF7A18' }}>
                {campaign.resellType === 'percentage' ? `${campaign.resellValue}%` : `${campaign.resellValue} ETH`}
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
                (Minimum 10% deduction on resale)
              </Typography>
            </Box>

            <Divider sx={{ my: 2, backgroundColor: '#333' }} />

            {!hasUserNFTs && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>Auction Ends In</Typography>
                {!hasEnded ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`${timeLeft.days}d`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
                    <Chip label={`${timeLeft.hours}h`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
                    <Chip label={`${timeLeft.minutes}m`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
                    <Chip label={`${timeLeft.seconds}s`} variant="outlined" sx={{ color: '#FF7A18', borderColor: '#FF7A18' }} />
                  </Box>
                ) : (
                  <Chip label="Auction Has Ended" color="error" sx={{ fontWeight: 'bold' }} />
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <Button
              variant="contained"
              fullWidth
              onClick={onContribute}
              disabled={hasEnded || isOwner}
              sx={{
                mb: 2,
                borderRadius: '12px',
                py: 1.5,
                background: hasEnded ? '#666' : 'linear-gradient(90deg, #FF7A18, #AF002D)',
                fontWeight: 'bold',
                '&:hover': !hasEnded && {
                  background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
                }
              }}
            >
              {hasEnded ? 'Auction Ended' : 'Contribute to Campaign'}
            </Button>

            {isOwner && (
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  color: '#FF7A18',
                  borderColor: '#FF7A18',
                  fontWeight: 'bold',
                  '&:hover': {
                    borderColor: '#FF9A52',
                    backgroundColor: 'rgba(255, 122, 24, 0.1)'
                  }
                }}
              >
                Edit Campaign
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* NFT Collection Section */}
      <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)', color: '#fff', border: '1px solid #FF7A18' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#FF7A18' }}>Linked NFT Collection</Typography>
          {(isOwner && (!campaign.nfts || campaign.nfts.length === 0)) && (
            <Button
              variant="contained"
              onClick={onMintClick}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #FF7A18, #AF002D)',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
                }
              }}
            >
              Mint NFT
            </Button>
          )}
        </Box>
        <NFTGrid nfts={campaign.nfts} onMintClick={onMintClick} />
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            color: '#fff',
            border: '2px solid #FF7A18'
          }
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          <IconButton
            aria-label="close"
            onClick={() => setShowDetails(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#FF7A18',
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h4" sx={{ color: '#FF7A18', mb: 3, textAlign: 'center' }}>
            NFT Details
          </Typography>
          
          {hasUserNFTs && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src={userNFTs[0].image} 
                  alt={userNFTs[0].name}
                  sx={{ 
                    width: '100%', 
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ mb: 2, color: '#FF7A18' }}>{userNFTs[0].name}</Typography>
                <Typography variant="body1" sx={{ color: '#ccc', mb: 3 }}>
                  {userNFTs[0].description || 'No description available'}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#999' }}>Token ID</Typography>
                  <Typography variant="body1" sx={{ color: '#FF7A18' }}>{userNFTs[0].tokenId}</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#999' }}>Edition</Typography>
                  <Typography variant="body1" sx={{ color: '#FF7A18' }}>
                    {userNFTs[0].editionNumber} of {userNFTs[0].totalEditions}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#999' }}>Attributes</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {userNFTs[0].attributes && userNFTs[0].attributes.map((attr, index) => (
                      <Chip 
                        key={index}
                        label={`${attr.trait_type}: ${attr.value}`}
                        variant="outlined"
                        sx={{ color: '#FF7A18', borderColor: '#FF7A18' }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(90deg, #FF7A18, #AF002D)',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
                      }
                    }}
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#FF7A18',
                      borderColor: '#FF7A18',
                      '&:hover': {
                        borderColor: '#FF9A52',
                        backgroundColor: 'rgba(255, 122, 24, 0.1)'
                      }
                    }}
                  >
                    List for Sale
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CampaignDetail;