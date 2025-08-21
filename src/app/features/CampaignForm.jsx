// src/app/features/CampaignForm.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateDraftCampaign, addCampaign, clearDraft, startNewCampaign } from './campaignSlice';

const steps = ['Category & Description', 'Token Details', 'Resell & Auction'];
const categories = ['Art', 'Music', 'Gaming', 'Photography', 'Collectibles'];
const auctionDurations = [
  { label: '60 Days', value: 60 },
  { label: '120 Days', value: 120 },
  { label: '240 Days', value: 240 },
  { label: 'Custom', value: 'custom' },
];

const CampaignForm = ({ onComplete }) => {
  const dispatch = useDispatch();
  const { draftCampaign } = useSelector(state => state.campaign);
  const [activeStep, setActiveStep] = React.useState(0);
  const [showCustomDuration, setShowCustomDuration] = React.useState(false);

  React.useEffect(() => {
    dispatch(startNewCampaign());
    return () => {
      dispatch(clearDraft());
    };
  }, [dispatch]);

  const form = draftCampaign || {};

  const handleChange = (field, value) => {
    dispatch(updateDraftCampaign({ [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    if (draftCampaign) {
      dispatch(addCampaign(draftCampaign));
      onComplete && onComplete();
    }
  };

  const handleAuctionDurationChange = (value) => {
    if (value === 'custom') {
      setShowCustomDuration(true);
      handleChange('auctionDuration', null);
    } else {
      setShowCustomDuration(false);
      handleChange('auctionDuration', parseInt(value));
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + parseInt(value));
      handleChange('auctionEndTime', endTime.toISOString());
    }
  };

  const handleCustomDurationChange = (days) => {
    handleChange('auctionDuration', parseInt(days));
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + parseInt(days));
    handleChange('auctionEndTime', endTime.toISOString());
  };

  const inputStyles = {
    color: '#fff',
    '& .MuiInputBase-input': {
      color: '#fff',
    },
    '& .MuiInputLabel-root': {
      color: '#ccc',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#555',
      },
      '&:hover fieldset': {
        borderColor: '#FF7A18',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF7A18',
      },
    },
    '& .MuiSelect-icon': {
      color: '#fff',
    },
  };

  return (
    <Paper elevation={3} sx={{
      maxWidth: 700,
      mx: 'auto',
      my: 4,
      p: 4,
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
      color: '#fff',
      border: '1px solid #FF7A18'
    }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#FF7A18', fontWeight: 'bold', mb: 4 }}>
        Create New Campaign
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconProps={{ sx: { color: '#FF7A18' } }} sx={{ '& .MuiStepLabel-label': { color: '#fff' } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <TextField
            select
            fullWidth
            label="Category"
            value={form.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option} sx={{ color: '#000' }}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Campaign Description"
            multiline
            rows={4}
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your campaign, its goals, and what backers can expect..."
            sx={inputStyles}
          />
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <TextField
            fullWidth
            label="Token Name"
            value={form.tokenName || ''}
            onChange={(e) => handleChange('tokenName', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
          />
          <TextField
            fullWidth
            label="Token Symbol"
            value={form.tokenSymbol || ''}
            onChange={(e) => handleChange('tokenSymbol', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
          />
          <TextField
            fullWidth
            label="Total Token Supply"
            type="number"
            value={form.totalTokens || ''}
            onChange={(e) => handleChange('totalTokens', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
          />
          <TextField
            fullWidth
            label="Price Per Token (ETH)"
            type="number"
            value={form.perTokenPrice || ''}
            onChange={(e) => handleChange('perTokenPrice', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
            InputProps={{
              startAdornment: <InputAdornment position="start" sx={{ color: '#FF7A18' }}>Ξ</InputAdornment>,
            }}
          />
          <TextField
            fullWidth
            label="Funding Goal (ETH)"
            type="number"
            value={form.fundDesired || ''}
            onChange={(e) => handleChange('fundDesired', e.target.value)}
            sx={inputStyles}
            InputProps={{
              startAdornment: <InputAdornment position="start" sx={{ color: '#FF7A18' }}>Ξ</InputAdornment>,
            }}
          />
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ color: '#FF7A18', mb: 2 }}>Resell Type</FormLabel>
            <RadioGroup
              row
              value={form.resellType || 'percentage'}
              onChange={(e) => handleChange('resellType', e.target.value)}
            >
              <FormControlLabel value="percentage" control={<Radio sx={{ color: '#FF7A18' }} />} label="Percentage" sx={{ color: '#fff' }} />
              <FormControlLabel value="fixed" control={<Radio sx={{ color: '#FF7A18' }} />} label="Fixed Amount" sx={{ color: '#fff' }} />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label={form.resellType === 'percentage' ? 'Resell Percentage (%)' : 'Resell Fixed Amount (ETH)'}
            type="number"
            value={form.resellValue || ''}
            onChange={(e) => handleChange('resellValue', e.target.value)}
            sx={{ mb: 3, ...inputStyles }}
            InputProps={form.resellType === 'fixed' ? {
              startAdornment: <InputAdornment position="start" sx={{ color: '#FF7A18' }}>Ξ</InputAdornment>,
            } : {
              endAdornment: <InputAdornment position="end" sx={{ color: '#FF7A18' }}>%</InputAdornment>,
            }}
            helperText="Minimum 10% deduction on resale"
            FormHelperTextProps={{ sx: { color: '#FF7A18' } }}
          />

          <FormLabel component="legend" sx={{ color: '#FF7A18', mb: 2, display: 'block' }}>Auction Duration</FormLabel>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {auctionDurations.map((duration) => (
              <Chip
                key={duration.value}
                label={duration.label}
                clickable
                color={form.auctionDuration === duration.value ? 'primary' : 'default'}
                onClick={() => handleAuctionDurationChange(duration.value)}
                sx={{
                  backgroundColor: form.auctionDuration === duration.value ? '#FF7A18' : '#333',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: form.auctionDuration === duration.value ? '#FF7A18' : '#444',
                  }
                }}
              />
            ))}
          </Box>

          {showCustomDuration && (
            <TextField
              fullWidth
              label="Custom Duration (Days)"
              type="number"
              value={form.auctionDuration || ''}
              onChange={(e) => handleCustomDurationChange(e.target.value)}
              sx={inputStyles}
            />
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{
            borderRadius: '12px',
            color: '#FF7A18',
            borderColor: '#FF7A18',
            px: 4,
            '&:hover': {
              borderColor: '#FF9A52',
              backgroundColor: 'rgba(255, 122, 24, 0.1)'
            }
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(90deg, #FF7A18, #AF002D)',
            px: 4,
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(90deg, #AF002D, #FF7A18)',
            }
          }}
        >
          {activeStep === steps.length - 1 ? 'Create Campaign' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CampaignForm;