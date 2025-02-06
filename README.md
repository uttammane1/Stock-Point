
# Dynamically Updating Stock Graphs

This project is a single-page frontend application that dynamically displays stock graphs by fetching real-time stock data using a backend API. The stock graph updates in real-time as more data is processed on the server.

## Project SS

![Screenshot (80)](https://github.com/user-attachments/assets/55932807-36c5-41c7-8aee-126d6cf86e65)


## Overview

The app provides:
- A dropdown menu to select a stock.
- A dropdown menu to select the duration of the stock data (e.g., 1 day, 1 week, etc.).
- A dynamically updating graph displaying stock prices based on the selected stock and duration.

The backend simulates real-time stock data updates, where the data is fetched in multiple stages.

## Tech Stack

- **Frontend**: React, Axios, Recharts (for stock graphs), Material UI (for styling)
- **Backend**: Node.js, Express.js
- **API**: Custom APIs for fetching stock data.

## Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/imoamo/-dynamically-updating-stock-graphs.git
   cd dynamically-updating-stock-graphs/frontend
   ```

2. Install the required dependencies:
   ```bash
   yarn install
   ```

3. Start the frontend application:
   ```bash
   yarn start
   ```

   The frontend should be running at `http://localhost:3001`.

## Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   yarn install
   ```

3. Start the backend server:
   ```bash
   yarn start
   ```

   The backend should be running at `http://localhost:3000`.

## Running the Application

Once both the frontend and backend are running, the app will be available at `http://localhost:3001`.

### Features:
- Select a stock from the dropdown.
- Choose a duration for the selected stock.
- View the dynamically updating graph for the selected stock and duration.


## Components

### 1. **StockSelector**
A dropdown component that allows users to select a stock. It fetches the list of available stocks from the backend API.

### 2. **DurationSelector**
A dropdown component that allows users to select a duration for the selected stock (e.g., 1 day, 1 week, etc.).

### 3. **StockGraph**
A component that dynamically fetches and displays the stock data for the selected stock and duration. It updates the graph in real-time as more data is fetched from the backend.

### 4. **App**
The main component that brings everything together. It includes the `StockSelector`, `DurationSelector`, and `StockGraph` components.


