import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, setSelectedStock } from '../redux/stocksSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

const StockDropdown: React.FC = () => {
  const { stocks, selectedStock, loading } = useSelector((state: RootState) => state.stocks);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleChange = (event: any) => {
    const selected = stocks.find((stock) => stock.id === event.target.value);
    if (selected) {
      dispatch(setSelectedStock(selected));
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
      <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'rgba(250, 247, 247, 0.9)', borderRadius: 3 }}>
        <InputLabel sx={{ color: 'black', py:2 }}>Select Stock</InputLabel>
        <Select value={selectedStock?.id || ''} onChange={handleChange} disabled={loading} sx={{ color: 'black' , py:3}}>
          {stocks.map((stock) => (
            <MenuItem key={stock.id} value={stock.id}>
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StockDropdown;
