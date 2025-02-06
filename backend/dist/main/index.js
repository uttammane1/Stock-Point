"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("./service");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the alloan.ai API!' });
});
router.get('/stocks', (req, res) => {
    const response = (0, service_1.getAllStockMeta)();
    res.json(response);
});
router.post('/stocks/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    console.log(body);
    if (!body.duration) {
        res.status(400).json({ message: 'Duration is required' });
    }
    const reqBody = {
        id: id,
        duration: (body.duration).toLowerCase(),
    };
    const response = (0, service_1.pollStock)(reqBody);
    res.json(response);
});
exports.default = router;
