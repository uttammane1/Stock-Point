import stocks from './../data/stocks.json';
import aapl_nasdaq_1y from './../data/aapl_nasdaq_1y.json';
import aapl_nasdaq_5y from './../data/aapl_nasdaq_5y.json';
import msft_nasdaq_6m from './../data/msft_nasdaq_6m.json';
import msft_nasdaq_5y from './../data/msft_nasdaq_5y.json';
import nvda_nasdaq_6m from './../data/nvda_nasdaq_6m.json';
import nvda_nasdaq_1y from './../data/nvda_nasdaq_1y.json';
import nvda_nasdaq_5y from './../data/nvda_nasdaq_5y.json';
import cache from '../cache';


enum Status {
    COMPLETE = "COMPLETE",
    ERROR = "ERROR",
    IN_PROGRESS = "IN_PROGRESS",
    STARTING = "STARTING"
}

export const getStocks = () => {
    const mapping = {
        "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
            "name": "Apple Inc.",
            "symbol": "AAPL:NASDAQ",
            "available": ["5y", "1y"],
            "5y": aapl_nasdaq_5y,
            "1y": aapl_nasdaq_1y
        },
        "7c9e6679-7425-40de-944b-e07fc1f90ae7": {
            "name": "Microsoft Corporation",
            "symbol": "MSFT:NASDAQ",
            "available": ["5y", "6m"],
            "5y": msft_nasdaq_5y,
            "6m": msft_nasdaq_6m
        },
        "550e8400-e29b-41d4-a716-446655440000": {
            "name": "NVIDIA Corporation",
            "symbol": "NVDA:NASDAQ",
            "available": ["5y", "1y", "6m"],
            "5y": nvda_nasdaq_5y,
            "1y": nvda_nasdaq_1y,
            "6m": nvda_nasdaq_6m
        }
    }
    return mapping;
}


export const getAllStockMeta = () => {
    const mapping:any = getStocks();
    const response = Object.keys(mapping).map((key) => {
        return {
            id: key,
            name: mapping[key].name,
            symbol: mapping[key].symbol,
            available: mapping[key].available
        }
    });
    return response;
}


export const pollStock = ({
    id,
    duration
}: {
    id: string,
    duration: string
    }) => {
    const mapping: any = getStocks();
    if (!mapping[id]) {
        return {
            message: "Stock not found"
        }
    }
    if (!mapping[id][duration]) {
        return {
            message: "Duration not found"
        }
    }
    const data = generatePollingData({
        data: mapping[id][duration],
        duration: duration
        
    });
    return data;
}

export const generatePollingData = ({
    data,
    duration
}: {
    data: any
    duration: string
    }) => {
    const symbol = data.symbol;
    const key = `${symbol}-${duration}`;
    const checkCache: any = cache.get(key);
    const graphData = data.time_series;
    const fullDataLength = Object.keys(graphData).length;
    if (checkCache) {
        const numberOfPartitions = checkCache.numberOfPartitions;
        const pollingTime = checkCache.pollingTime;
        const timestamp = checkCache.timestamp;

        const currentTimeStamp = new Date().getTime();

        const timeElapsed = (currentTimeStamp - timestamp)/1000;

        console.log("timeElapsed", timeElapsed, "pollingTime", pollingTime);
        if (timeElapsed > pollingTime) {
            return {
                data: howMuchDataToReturn(graphData, fullDataLength),
                status: Status.COMPLETE
            }
        }
        const timeElapsedInPercent = (timeElapsed) / pollingTime;
        if (timeElapsedInPercent > 0) {
            const newIndex = timeElapsedInPercent * fullDataLength 
            return {
                data: howMuchDataToReturn(graphData, newIndex),
                status: Status.IN_PROGRESS
            }
        }
        else {
            return {
                data: [],
                status: Status.STARTING
            };
        }
    }
    else {
        const timestamp = new Date().getTime();
        const pollingTime = (Math.floor(Math.random() * (60)) + 45);
        const numberOfPartitions = Math.ceil(fullDataLength / pollingTime);
        const obj = {
            symbol: symbol,
            duration: duration,
            timestamp,
            pollingTime,
            numberOfPartitions
        }
        cache.set(key, obj);
        return [];
    }
}

const howMuchDataToReturn = (timeSeries: Record<string, any>, lastIndex: number) => {
    const keysOfTimeSeries = Object.keys(timeSeries);
    const slicedKeys = keysOfTimeSeries.slice(0, lastIndex);
    const data = slicedKeys.map((key) => {
        const res = {
            ...timeSeries[key],
            timestamp: key
        }
        return res;
    });
    return data;
}