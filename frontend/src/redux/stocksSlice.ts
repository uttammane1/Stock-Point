import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Stock {
  id: string;
  name: string;
  durations: string[];
}

export interface GraphData {
  timestamp: string[];
  price: number[];
  change: number[];
  change_percent: number[];
  volume: number[];
  status: string;
}

interface StockState {
  stocks: Stock[];
  selectedStock: Stock | null;
  selectedDuration: string | null;
  graphData: GraphData; // Remove `| null`
  loading: boolean;
}

const initialState: StockState = {
  stocks: [],
  selectedStock: null,
  selectedDuration: null,
  graphData: {
    timestamp: [],
    price: [],
    change: [],
    change_percent: [],
    volume: [],
    status: 'IN_PROGRESS',
  },
  loading: false,
};

// Fetch stocks from the API
export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const BASEURL = process.env.BASEURL
  const response = await axios.get(`http://localhost:8000/api/stocks`);
  return response.data.map((stock: any) => ({
    ...stock,
    durations: stock.available,
  }));
});

export interface GraphDataResponse {
  data: {
    timestamp: string[];
    price: number[];
    change: number[];
    change_percent: number[];
    volume: number[];
  };
  status?: string;
}


export const fetchGraphData = createAsyncThunk<GraphDataResponse, { id: string; duration: string }>(
  'stocks/fetchGraphData',
  async ({ id, duration }) => {
    const BASEURL = process.env.REACT_APP_BASEURL
    const response = await axios.post(`http://localhost:8000/api/stocks/${id}`, { duration });
    // const response = await axios.post(`${BASEURL}api/stocks/${id}`, { duration });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid API response'); 
    }

    const { data, status } = response.data;

    const transformedData: GraphDataResponse = {
      data: {
        timestamp: data.map((item: any) => item.timestamp),
        price: data.map((item: any) => item.price),
        change: data.map((item: any) => item.change),
        change_percent: data.map((item: any) => item.change_percent),
        volume: data.map((item: any) => item.volume),
      },
      status: status || 'IN_PROGRESS',
    };

    return transformedData;
  }
);





const StocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    setSelectedDuration: (state, action) => {
      state.selectedDuration = action.payload;
    },
    resetGraphData: (state) => {
      state.graphData = {
        timestamp: [],
        price: [],
        change: [],
        change_percent: [],
        volume: [],
        status: 'IN_PROGRESS',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.loading = false;
      })
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        const { data, status } = action.payload;
  
        if (status === 'IN_PROGRESS') {
        
          state.graphData = {
            timestamp: [...(state.graphData?.timestamp || []), ...data.timestamp],
            price: [...(state.graphData?.price || []), ...data.price],
            change: [...(state.graphData?.change || []), ...data.change],
            change_percent: [...(state.graphData?.change_percent || []), ...data.change_percent],
            volume: [...(state.graphData?.volume || []), ...data.volume],
            status: 'IN_PROGRESS',
          };
        } else if (status === 'COMPLETE') {
     
          state.graphData = {
            timestamp: [...(state.graphData?.timestamp || []), ...data.timestamp],
            price: [...(state.graphData?.price || []), ...data.price],
            change: [...(state.graphData?.change || []), ...data.change],
            change_percent: [...(state.graphData?.change_percent || []), ...data.change_percent],
            volume: [...(state.graphData?.volume || []), ...data.volume],
            status: 'COMPLETE',
          };
        }
      });
  },
});

export const { setSelectedStock, setSelectedDuration, resetGraphData } = StocksSlice.actions;
export default StocksSlice.reducer;