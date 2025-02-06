import { Box, Card, CardContent, Typography } from '@mui/material'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import React, { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGraphData, GraphDataResponse, resetGraphData } from '../redux/stocksSlice'
import { AppDispatch, RootState } from '../redux/store'

Chart.register(...registerables, zoomPlugin)

const StockGraph: React.FC = () => {
  const { selectedStock, selectedDuration, graphData } = useSelector((state: RootState) => state.stocks)
  const dispatch = useDispatch<AppDispatch>()
  const [isUpdating, setIsUpdating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!selectedStock || !selectedDuration) return;

    dispatch(resetGraphData());
    let isMounted = true;

    const fetchData = async () => {
      setIsUpdating(true)
      const result = await dispatch(fetchGraphData({ id: selectedStock.id, duration: selectedDuration }))
      const payload = result.payload as GraphDataResponse
      if (!isMounted) return
      setIsUpdating(false)

      const status = payload?.status || 'IN_PROGRESS'
      if (status === 'IN_PROGRESS') {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(fetchData, 5000)
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    };
  }, [selectedStock, selectedDuration, dispatch]);

  const downsample = (data: number[], factor: number) => {
    return data.filter((_, index) => index % factor === 0)
  }

  const factor = graphData?.timestamp?.length > 100 ? Math.ceil(graphData.timestamp.length / 100) : 1

  const timestamps = graphData?.timestamp?.map((timestamp) => {
    const parts = timestamp.split(' ')
    const dateParts = parts[0].split('-')
    const timeParts = parts[1].split(':')
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2])).getTime()
  }) || []

  const labels = downsample(timestamps, factor).map(timestamp => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  })

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Stock Price',
        data: downsample(graphData?.price || [], factor),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Price Change',
        data: downsample(graphData?.change || [], factor),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Volume',
        data: downsample(graphData?.volume || [], factor),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const,
        },
      },
    },
  }

  return (
    <Card
      sx={{
        boxShadow: 4,
        borderRadius: 3,
        p: { xs: 0, md: 3 },
        // background: "linear-gradient(to right, #fff, #ccc)",
        // color: 'white',
        // height:"90%"
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#111' }}>
          {selectedStock?.name} Stock Analysis
        </Typography>
        <Box
          sx={{
            background: "#fff",
            borderRadius: 2,
            p: { xs: 0, md: 2 },
            boxShadow: 3,
            position: 'relative',
            height: '600px',
          }}
        >
          {isUpdating && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'black',
                zIndex: 10,
              }}
            >
              Updating...
            </Box>
          )}
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
  
}

export default StockGraph