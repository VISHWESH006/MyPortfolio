const https = require("https");

function httpsGet(url, headers) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://codeforces.com/",
                "Origin": "https://codeforces.com"
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return httpsGet(res.headers.location, headers).then(resolve).catch(reject);
            }
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve({ status: res.statusCode, body: data }));
        }).on("error", reject);
    });
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        const { endpoint, ...params } = req.query;

        const allowed = ["user.info", "user.status", "user.rating"];
        if (!allowed.includes(endpoint)) {
            return res.status(400).json({ error: "Invalid endpoint" });
        }

        const qs = new URLSearchParams(params).toString();
        const url = `https://codeforces.com/api/${endpoint}?${qs}`;

        const { status, body } = await httpsGet(url);

        if (status === 403) return res.status(403).json({ error: "CF blocked this server IP — use direct fetch fallback" });
        if (status === 429) return res.status(429).json({ error: "Rate limited" });
        if (status !== 200) return res.status(status).json({ error: `CF returned ${status}`, body });

        let data;
        try {
            data = JSON.parse(body);
        } catch {
            return res.status(500).json({ error: "CF returned non-JSON", raw: body.slice(0, 200) });
        }

        res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate");
        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: e.message, stack: e.stack });
    }
};