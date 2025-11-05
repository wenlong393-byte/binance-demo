// api/order.js
import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" });
    }

    // 从前端接收下单参数
    const { symbol, side, quantity, price } = req.body;

    // 从环境变量中取出 Binance 的 Key（我们稍后在 Vercel 里配置）
    const API_KEY = process.env.BINANCE_API_KEY;
    const API_SECRET = process.env.BINANCE_API_SECRET;

    // Binance 测试网接口地址
    const baseURL = "https://testnet.binance.vision/api/v3";

    // 生成签名
    const timestamp = Date.now();
    const query = `symbol=${symbol}&side=${side}&type=LIMIT&timeInForce=GTC&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

    try {
        // 发请求到 Binance
        const resp = await axios.post(`${baseURL}/order?${query}&signature=${signature}`, {}, {
            headers: { "X-MBX-APIKEY": API_KEY }
        });
        res.status(200).json(resp.data);
    } catch (error) {
        res.status(400).json({
            message: error.response?.data || error.message
        });
    }
}