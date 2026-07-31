const https = require("https");

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        const { username } = req.query;
        console.log("Received username:", username);
        if (!username) {
            return res.status(400).json({ error: "vishwesh006" });
        }

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
                        totalSubmissionNum {
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

            const request = https.request(LEETCODE_GRAPHQL_URL, reqOptions, (res) => {
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

        const submitStats = matchedUser.submitStats || {};
        const acSubmissionNum = submitStats.acSubmissionNum || [];
        const totalSubmissionNum = submitStats.totalSubmissionNum || [];

        const getCount = (difficulty, source) => {
            const item = source.find(entry => entry.difficulty === difficulty);
            return item?.count ?? 0;
        };

        const totalAccepted = getCount("All", acSubmissionNum);
        const totalSubmitted = getCount("All", totalSubmissionNum);
        const acceptance = totalSubmitted > 0 ? Math.round((totalAccepted / totalSubmitted) * 100) : 0;

        const stats = {
            totalSolved: totalAccepted || getCount("All", acSubmissionNum) || 0,
            easySolved: getCount("Easy", acSubmissionNum) || 0,
            mediumSolved: getCount("Medium", acSubmissionNum) || 0,
            hardSolved: getCount("Hard", acSubmissionNum) || 0,
            acceptRate: acceptance,
            rank: matchedUser.profile?.ranking ?? 0
        };

        res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate");
        return res.status(200).json({ stats });
    } catch (e) {
        return res.status(500).json({ error: e.message, stack: e.stack });
    }
};
