// api/order.js
const crypto = require("crypto");
const axios = require("axios");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" });
    }

    const { symbol, side, quantity, price } = req.body;

    const API_KEY = process.env.BINANCE_API_KEY;
    const API_SECRET = process.env.BINANCE_API_SECRET;
    const baseURL = "https://testnet.binance.vision/api/v3";

    const timestamp = Date.now();
    const query = `symbol=${symbol}&side=${side}&type=LIMIT&timeInForce=GTC&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

    try {
        const resp = await axios.post(`${baseURL}/order?${query}&signature=${signature}`, {}, {
            headers: { "X-MBX-APIKEY": API_KEY }
        });
        res.status(200).json(resp.data);
    } catch (error) {
        res.status(400).json({
            message: error.response?.data || error.message
        });
    }
};