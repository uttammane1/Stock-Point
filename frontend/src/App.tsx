import { Container, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import StockDropdown from './components/StockDropdown';
import DurationSelector from './components/DurationSelector';
import StockGraph from './components/StockGraph';

function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); 
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        height: "100vh",
        color: "#121212",
        padding: "4px",
      }}
    >
      <nav style={{textAlign:"center"}}>
      <h1>Stock Point</h1>
      </nav>
      <Grid container spacing={2} direction={isSmallScreen ? "column" : "row"}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}> 
          <Box my={4}>
            <StockDropdown />
          </Box>
          <Box my={4}>
            <DurationSelector />
          </Box>
        </Grid>

        {/* Stock Graph */}
        <Grid item xs={12} md={9} sx={{ height: "80%" }}>
          <StockGraph />
        </Grid>
      </Grid>
    </Box>
  
  
  );
}

export default App;
