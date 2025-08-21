import React from 'react';
import { Button, Box } from '@mui/material';

const StepNavigation = ({ back, next, isNextDisabled }) => (
  <Box mt={3} display="flex" justifyContent="space-between">
    <Button variant="outlined" onClick={back}>Back</Button>
    <Button variant="contained" onClick={next} disabled={isNextDisabled}>Next</Button>
  </Box>
);

export default StepNavigation;
