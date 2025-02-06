import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60 * 60, // 1 hours,
  checkperiod: 60 * 30, // 1 hour
});

export default cache;