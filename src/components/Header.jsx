import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Box,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import CollectionsIcon from '@mui/icons-material/Collections';

const Header = ({ selectedCollection, setSelectedCollection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const collections = useSelector(state => state.nft.collections) || [];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = useMemo(() => {
    if (!searchQuery) return collections;
    return collections.filter(collection =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        color: '#fff', // Keep text color white
        borderBottom: '1px solid #FF7A18', // Orange border
        py: 1
      }} 
      elevation={0}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 2 : 0
      }}>
        {/* Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: '800', 
            color: '#FF7A18', // Title in orange
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          NFT Campaigns
        </Typography>

        {/* Right-side Controls */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* Collections Dropdown */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel 
              id="collections-select-label"
              sx={{ color: '#FF7A18' }} // Orange label
            >
              Collections
            </InputLabel>
            <Select
              labelId="collections-select-label"
              label="Collections"
              value={selectedCollection || ''}
              onChange={e => setSelectedCollection(e.target.value)}
              startAdornment={(
                <InputAdornment position="start" sx={{ mr: 1, color: '#FF7A18' }}> {/* Orange icon */}
                  <CollectionsIcon fontSize="small" />
                </InputAdornment>
              )}
              sx={{
                color: '#fff', // White text
                '& .MuiSelect-icon': { color: '#FF7A18' }, // Orange dropdown icon
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FF7A18' }, // Orange border
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF7A18' }, // Orange on hover
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF7A18' } // Orange on focus
              }}
            >
              {filteredCollections.length === 0 ? (
                <MenuItem disabled value="">
                  <em style={{ color: '#fff' }}>{collections.length === 0 ? 'No collections found' : 'No matches'}</em> {/* White text */}
                </MenuItem>
              ) : (
                filteredCollections.map(c => (
                  <MenuItem key={c.id} value={c.id} sx={{ color: '#fff' }}>{c.name}</MenuItem> // White text
                ))
              )}
            </Select>
          </FormControl>

          {/* Search Input */}
          <TextField
            placeholder="Search Collections..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#FF7A18' }}> {/* Orange icon */}
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: isMobile ? '100%' : 250,
              '& .MuiInputBase-input': { 
                color: '#fff', // White text
                py: 1
              },
              '& .MuiOutlinedInput-notchedOutline': { 
                borderColor: '#FF7A18', // Orange border
                borderRadius: 2
              },
              '&:hover .MuiOutlinedInput-notchedOutline': { 
                borderColor: '#FF7A18' // Orange on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                borderColor: '#FF7A18' // Orange on focus
              }
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;