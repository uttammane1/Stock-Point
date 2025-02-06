import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDuration } from '../redux/stocksSlice';
import { AppDispatch, RootState } from '../redux/store';
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

const DurationSelector: React.FC = () => {
  const { selectedStock, selectedDuration } = useSelector((state: RootState) => state.stocks);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: any) => {
    dispatch(setSelectedDuration(event.target.value));
  };

  if (!selectedStock) return null;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
      <FormControl fullWidth variant="outlined" sx={{ background: 'white', borderRadius: 3 }}>
        <InputLabel sx={{ color: 'black', py:2 }}>Select Duration</InputLabel>
        <Select value={selectedDuration || ''} onChange={handleChange} sx={{ color: 'black', py:3 }}>
          {selectedStock?.durations.map((duration) => (
            <MenuItem key={duration} value={duration}>
              {duration}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DurationSelector;
