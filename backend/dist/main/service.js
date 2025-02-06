"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePollingData = exports.pollStock = exports.getAllStockMeta = exports.getStocks = void 0;
const aapl_nasdaq_1y_json_1 = __importDefault(require("./../data/aapl_nasdaq_1y.json"));
const aapl_nasdaq_5y_json_1 = __importDefault(require("./../data/aapl_nasdaq_5y.json"));
const msft_nasdaq_6m_json_1 = __importDefault(require("./../data/msft_nasdaq_6m.json"));
const msft_nasdaq_5y_json_1 = __importDefault(require("./../data/msft_nasdaq_5y.json"));
const nvda_nasdaq_6m_json_1 = __importDefault(require("./../data/nvda_nasdaq_6m.json"));
const nvda_nasdaq_1y_json_1 = __importDefault(require("./../data/nvda_nasdaq_1y.json"));
const nvda_nasdaq_5y_json_1 = __importDefault(require("./../data/nvda_nasdaq_5y.json"));
const cache_1 = __importDefault(require("../cache"));
var Status;
(function (Status) {
    Status["COMPLETE"] = "COMPLETE";
    Status["ERROR"] = "ERROR";
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["STARTING"] = "STARTING";
})(Status || (Status = {}));
const getStocks = () => {
    const mapping = {
        "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
            "name": "Apple Inc.",
            "symbol": "AAPL:NASDAQ",
            "available": ["5y", "1y"],
            "5y": aapl_nasdaq_5y_json_1.default,
            "1y": aapl_nasdaq_1y_json_1.default
        },
        "7c9e6679-7425-40de-944b-e07fc1f90ae7": {
            "name": "Microsoft Corporation",
            "symbol": "MSFT:NASDAQ",
            "available": ["5y", "6m"],
            "5y": msft_nasdaq_5y_json_1.default,
            "6m": msft_nasdaq_6m_json_1.default
        },
        "550e8400-e29b-41d4-a716-446655440000": {
            "name": "NVIDIA Corporation",
            "symbol": "NVDA:NASDAQ",
            "available": ["5y", "1y", "6m"],
            "5y": nvda_nasdaq_5y_json_1.default,
            "1y": nvda_nasdaq_1y_json_1.default,
            "6m": nvda_nasdaq_6m_json_1.default
        }
    };
    return mapping;
};
exports.getStocks = getStocks;
const getAllStockMeta = () => {
    const mapping = (0, exports.getStocks)();
    const response = Object.keys(mapping).map((key) => {
        return {
            id: key,
            name: mapping[key].name,
            symbol: mapping[key].symbol,
            available: mapping[key].available
        };
    });
    return response;
};
exports.getAllStockMeta = getAllStockMeta;
const pollStock = ({ id, duration }) => {
    const mapping = (0, exports.getStocks)();
    if (!mapping[id]) {
        return {
            message: "Stock not found"
        };
    }
    if (!mapping[id][duration]) {
        return {
            message: "Duration not found"
        };
    }
    const data = (0, exports.generatePollingData)({
        data: mapping[id][duration],
        duration: duration
    });
    return data;
};
exports.pollStock = pollStock;
const generatePollingData = ({ data, duration }) => {
    const symbol = data.symbol;
    const key = `${symbol}-${duration}`;
    const checkCache = cache_1.default.get(key);
    const graphData = data.time_series;
    const fullDataLength = Object.keys(graphData).length;
    if (checkCache) {
        const numberOfPartitions = checkCache.numberOfPartitions;
        const pollingTime = checkCache.pollingTime;
        const timestamp = checkCache.timestamp;
        const currentTimeStamp = new Date().getTime();
        const timeElapsed = (currentTimeStamp - timestamp) / 1000;
        console.log("timeElapsed", timeElapsed, "pollingTime", pollingTime);
        if (timeElapsed > pollingTime) {
            return {
                data: howMuchDataToReturn(graphData, fullDataLength),
                status: Status.COMPLETE
            };
        }
        const timeElapsedInPercent = (timeElapsed) / pollingTime;
        if (timeElapsedInPercent > 0) {
            const newIndex = timeElapsedInPercent * fullDataLength;
            return {
                data: howMuchDataToReturn(graphData, newIndex),
                status: Status.IN_PROGRESS
            };
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
        };
        cache_1.default.set(key, obj);
        return [];
    }
};
exports.generatePollingData = generatePollingData;
const howMuchDataToReturn = (timeSeries, lastIndex) => {
    const keysOfTimeSeries = Object.keys(timeSeries);
    const slicedKeys = keysOfTimeSeries.slice(0, lastIndex);
    const data = slicedKeys.map((key) => {
        const res = Object.assign(Object.assign({}, timeSeries[key]), { timestamp: key });
        return res;
    });
    return data;
};
