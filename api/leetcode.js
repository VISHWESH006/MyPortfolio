const https = require("https");

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9"
            }
        };

        https.get(url, options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve({ status: res.statusCode, body: data }));
        }).on("error", reject);
    });
}

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: "vishwesh006" });
        }

        const url = `https://leetcode.com/graphql`;
        const query = `
            query userProblemsSolved($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile {
                        ranking
                    }
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                }
            }
        `;

        const payload = JSON.stringify({
            query,
            variables: { username }
        });

        const { status, body } = await new Promise((resolve, reject) => {
            const reqOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload),
                    "User-Agent": "Mozilla/5.0"
                }
            };

            const request = https.request(url, reqOptions, (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => resolve({ status: res.statusCode, body: data }));
            });

            request.on("error", reject);
            request.write(payload);
            request.end();
        });

        if (status !== 200) {
            return res.status(status).json({ error: "LeetCode API request failed", body });
        }

        let data;
        try {
            data = JSON.parse(body);
        } catch {
            return res.status(500).json({ error: "LeetCode returned non-JSON", raw: body.slice(0, 200) });
        }

        const matchedUser = data?.data?.matchedUser;
        if (!matchedUser) {
            return res.status(404).json({ error: "LeetCode user not found" });
        }

        const acSubmissionNum = matchedUser.submitStats?.acSubmissionNum || [];
        const getCount = (difficulty) => {
            const item = acSubmissionNum.find(entry => entry.difficulty === difficulty);
            return item?.count ?? 0;
        };

        const stats = {
            totalSolved: getCount("All") ?? 0,
            easySolved: getCount("Easy") ?? 0,
            mediumSolved: getCount("Medium") ?? 0,
            hardSolved: getCount("Hard") ?? 0,
            acceptRate: 0,
            rank: matchedUser.profile?.ranking ?? 0
        };

        res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate");
        return res.status(200).json({ stats });
    } catch (e) {
        return res.status(500).json({ error: e.message, stack: e.stack });
    }
};
