export default async function handler(req, res) {
    const { endpoint, ...params } = req.query;

    const allowed = ["user.info", "user.status", "user.rating"];
    if (!allowed.includes(endpoint)) {
        return res.status(400).json({ error: "Invalid endpoint" });
    }

    const qs = new URLSearchParams(params).toString();
    const url = `https://codeforces.com/api/${endpoint}?${qs}`;

    try {
        const cfRes = await fetch(url);

        if (cfRes.status === 429) {
            return res.status(429).json({ error: "Rate limited" });
        }
        if (!cfRes.ok) {
            return res.status(cfRes.status).json({ error: "CF API error" });
        }

        const data = await cfRes.json();
        res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate");
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}