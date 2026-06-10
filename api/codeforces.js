const https = require("https");

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve({ status: res.statusCode, body: data }));
        }).on("error", reject);
    });
}

module.exports = async function handler(req, res) {
    const { endpoint, ...params } = req.query;

    const allowed = ["user.info", "user.status", "user.rating"];
    if (!allowed.includes(endpoint)) {
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    const qs = new URLSearchParams(params).toString();
    const url = `https://codeforces.com/api/${endpoint}?${qs}`;

    try {
        const { status, body } = await httpsGet(url);

        if (status === 429) {
            return res.status(429).json({ error: "Rate limited" });
        }
        if (status !== 200) {
            return res.status(status).json({ error: `CF returned ${status}` });
        }

        const data = JSON.parse(body);
        res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate");
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};