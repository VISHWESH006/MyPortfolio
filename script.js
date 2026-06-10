if (window.innerWidth > 768) {
    Shery.imageEffect("#back", {
        style: 5,
        config: {
            "a": { "value": 2.06, "range": [0, 30] },
            "b": { "value": -1, "range": [-1, 1] },
            "zindex": { "value": 9, "range": [-9999999, 9999999] },
            "aspect": { "value": 1 },
            "ignoreShapeAspect": { "value": false },
            "shapePosition": { "value": { "x": 0, "y": 0 } },
            "shapeScale": { "value": { "x": 0.5, "y": 0.5 } },
            "shapeEdgeSoftness": { "value": 0.24, "range": [0, 0.5] },
            "shapeRadius": { "value": 0, "range": [0, 2] },
            "currentScroll": { "value": 0 },
            "scrollLerp": { "value": 0.07 },
            "gooey": { "value": true },
            "infiniteGooey": { "value": true },
            "growSize": { "value": 1, "range": [1, 15] },
            "durationOut": { "value": 1, "range": [0.1, 5] },
            "durationIn": { "value": 1.3, "range": [0.1, 5] },
            "displaceAmount": { "value": 0.15 },
            "masker": { "value": false },
            "maskVal": { "value": 1, "range": [1, 5] },
            "scrollType": { "value": 0 },
            "geoVertex": { "range": [1, 64], "value": 1 },
            "noEffectGooey": { "value": true },
            "onMouse": { "value": 1 },
            "noise_speed": { "value": 0.2, "range": [0, 10] },
            "metaball": { "value": 0.17, "range": [0, 2], "_gsap": { "id": 3 } },
            "discard_threshold": { "value": 0.54, "range": [0, 1] },
            "antialias_threshold": { "value": 0, "range": [0, 0.1] },
            "noise_height": { "value": 0.5, "range": [0, 2] },
            "noise_scale": { "value": 10, "range": [0, 100] }
        },
        gooey: true
    });
}

const projectsData = [
    {
        num: "01",
        title: "PharmaKrypt",
        tag: "Supply Chain · Blockchain",
        desc: "Secure pharmaceutical supply chain & verification system. Medicine authentication, counterfeit prevention and traceability. Research paper published.",
        stack: ["React.js", "JavaScript", "Firebase", "Node.js"],
        link: "https://github.com/VISHWESH006"
    },
    {
        num: "02",
        title: "RubricAI",
        tag: "AI · Education",
        desc: "AI-powered evaluation & analysis platform. Automated rubric-based scoring for consistent and efficient assessments. Research paper published.",
        stack: ["Python", "React.js", "Firebase", "OpenAI API"],
        link: "https://github.com/VISHWESH006"
    },
    {
        num: "03",
        title: "MediMind.Live",
        tag: "Health · Community",
        desc: "Mental health support & resource platform. Responsive interfaces, community engagement and secure wellness workflows.",
        stack: ["React.js", "Tailwind", "Node.js", "Firebase"],
        link: "https://github.com/VISHWESH006"
    },
    {
        num: "04",
        title: "SN Developers",
        tag: "Freelance · Real Estate",
        desc: "Modern real estate website for a client. Property showcase, customer engagement and a professional scalable web presence.",
        stack: ["Wordpress"],
        link: "https://sndevelopers.net"
    }
];

const projMobileEl = document.querySelector(".proj-mobile");
if (projMobileEl) {
    const heading = document.createElement("h2");
    heading.className = "proj-mobile__heading";
    heading.textContent = "SELECTED WORK";
    projMobileEl.appendChild(heading);

    const cardsWrap = document.createElement("div");
    cardsWrap.className = "proj-mobile-cards";

    projectsData.forEach(p => {
        const card = document.createElement("div");
        card.className = "pcard";
        card.innerHTML = `
            <div class="pcard__accent"></div>
            <div class="pcard__inner">
                <div class="pcard__top-row">
                    <span class="pcard__num">( ${p.num} )</span>
                    <span class="pcard__tag">${p.tag}</span>
                </div>
                <h3 class="pcard__title">${p.title}</h3>
                <p class="pcard__desc">${p.desc}</p>
                <div class="pcard__stack">${p.stack.map(s => `<span>${s}</span>`).join("")}</div>
                <a class="pcard__link" href="${p.link}" target="_blank">Visit <i class="fa-solid fa-arrow-right fa-rotate-by" style="--fa-rotate-angle: -45deg;"></i></a>
            </div>
        `;
        cardsWrap.appendChild(card);
    });

    projMobileEl.appendChild(cardsWrap);

    const foot = document.createElement("p");
    foot.className = "proj-mobile-footer";
    foot.textContent = "04 Projects · Vishwesh Singh";
    projMobileEl.appendChild(foot);
}

async function loadCodeforcesStats() {
    const CF_HANDLE = "vishwesh07";
    const statusEl = document.getElementById("cf-status");
    const heatmapEl = document.getElementById("cf-heatmap");

    function setCardNum(id, val) {
        const el = document.getElementById(id);
        if (el) {
            const num = el.querySelector(".cf-card__num");
            if (num) {
                num.classList.remove("loading");
                num.textContent = val;
            }
        }
    }

    function setAllFailed() {
        document.querySelectorAll(".cf-card__num").forEach(el => {
            el.classList.remove("loading");
            el.textContent = "—";
        });
    }

    async function fetchWithRetry(endpoint, params, retries = 3, delay = 1500) {
        const qs = new URLSearchParams(params).toString();
        const proxyUrl = `/api/codeforces?endpoint=${endpoint}&${qs}`;
        const directUrl = `https://codeforces.com/api/${endpoint}?${qs}`;

        for (let i = 0; i < retries; i++) {
            try {
                const res = await fetch(proxyUrl);
                if (res.status === 403) {
                    const direct = await fetch(directUrl);
                    if (!direct.ok) throw new Error(`Direct CF HTTP ${direct.status}`);
                    return direct;
                }
                if (res.status === 429) {
                    if (i < retries - 1) {
                        await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
                        continue;
                    }
                    throw new Error("Rate limited after retries");
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res;
            } catch (e) {
                if (i === retries - 1) throw e;
                await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
            }
        }
    }

    document.querySelectorAll(".cf-card__num").forEach(el => el.classList.add("loading"));

    try {
        const CACHE_KEY = "cf_processed_data_v2";
        const CACHE_TIME_KEY = "cf_time_cache_v2";
        const CACHE_DURATION = 6 * 60 * 60 * 1000;

        let statsObject;
        const now = Date.now();
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData && cachedTime && (now - parseInt(cachedTime) < CACHE_DURATION)) {
            statsObject = JSON.parse(cachedData);
        } else {
            const [infoRes, statusRes, ratingRes] = await Promise.all([
                fetchWithRetry("user.info", { handles: CF_HANDLE }),
                fetchWithRetry("user.status", { handle: CF_HANDLE }),
                fetchWithRetry("user.rating", { handle: CF_HANDLE })
            ]);

            const statusData = await statusRes.json();
            const ratingData = await ratingRes.json();

            if (statusData.status !== "OK") throw new Error("CF API error");

            const submissions = statusData.result;
            const totalSubs = submissions.length;

            const acceptedSet = new Set();
            const daySet = new Set();
            const activityMap = {};

            submissions.forEach(s => {
                const d = new Date(s.creationTimeSeconds * 1000);
                const mapKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                activityMap[mapKey] = (activityMap[mapKey] || 0) + 1;

                if (s.verdict === "OK") {
                    acceptedSet.add(`${s.problem.contestId}_${s.problem.index}`);
                    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                }
            });

            const solved = acceptedSet.size;
            const accepted = submissions.filter(s => s.verdict === "OK").length;
            const acceptRate = totalSubs > 0 ? Math.round((accepted / totalSubs) * 100) : 0;
            const contests = ratingData.status === "OK" ? ratingData.result.length : 0;

            let currentStreak = 0;
            let maxStreak = 0;
            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                if (daySet.has(key)) {
                    streak++;
                    if (i === 0 || streak > 1) currentStreak = streak;
                } else {
                    if (i === 0) currentStreak = 0;
                    if (streak > maxStreak) maxStreak = streak;
                    streak = 0;
                }
            }
            if (streak > maxStreak) maxStreak = streak;

            statsObject = {
                solved,
                totalSubs,
                acceptRate,
                contests,
                currentStreak,
                maxStreak,
                activityMap
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(statsObject));
            localStorage.setItem(CACHE_TIME_KEY, now.toString());
        }

        setCardNum("cf-solved", statsObject.solved);
        setCardNum("cf-streak", statsObject.currentStreak + "d");
        setCardNum("cf-submissions", statsObject.totalSubs);
        setCardNum("cf-acceptance", statsObject.acceptRate + "%");
        setCardNum("cf-contests", statsObject.contests);
        setCardNum("cf-maxstreak", statsObject.maxStreak + "d");

        if (statusEl) statusEl.textContent = "live data";

        if (heatmapEl) {
            heatmapEl.innerHTML = "";
            const heatmapNow = new Date();
            heatmapNow.setHours(0, 0, 0, 0);
            const weeks = 26;
            const startDay = new Date(heatmapNow);
            startDay.setDate(heatmapNow.getDate() - (weeks * 7 - 1));

            for (let w = 0; w < weeks; w++) {
                const weekEl = document.createElement("div");
                weekEl.className = "cf-week";
                for (let d = 0; d < 7; d++) {
                    const dayEl = document.createElement("div");
                    dayEl.className = "cf-day";
                    const dayIndex = w * 7 + d;
                    const date = new Date(startDay);
                    date.setDate(startDay.getDate() + dayIndex);

                    if (date <= heatmapNow) {
                        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                        const count = statsObject.activityMap[key] || 0;
                        const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : count <= 10 ? 4 : 5;
                        dayEl.setAttribute("data-count", level);
                        dayEl.title = `${key}: ${count} submission${count !== 1 ? "s" : ""}`;
                    } else {
                        dayEl.style.opacity = "0";
                    }
                    weekEl.appendChild(dayEl);
                }
                heatmapEl.appendChild(weekEl);
            }
        }

    } catch (e) {
        console.error("Codeforces Fetch Error:", e);
        if (statusEl) statusEl.textContent = "unavailable (rate limited or down)";
        setAllFailed();
    }
}

loadCodeforcesStats();

var video = document.querySelector("#video");
var videobtn = document.querySelector("#video-btn");

if (videobtn) {
    videobtn.addEventListener("click", function () {
        if (videobtn.innerText.trim() === "> PLAY") {
            video.style.zIndex = "9";
            videobtn.innerText = "PAUSE";
        } else {
            video.style.zIndex = "-1";
            videobtn.innerText = "> PLAY";
        }
    });
}

const groups = document.querySelectorAll(".ele");
const totalSlides = groups.length > 0 ? groups[0].querySelectorAll("h1").length : 0;

let sharedIndex = 0;
let isAnimating = false;

document.querySelector("#Achievement").addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex = (sharedIndex + 1) % totalSlides;

    const tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.inOut" },
        onComplete: () => {
            groups.forEach(group => {
                gsap.set(group.querySelectorAll("h1")[sharedIndex], { top: "100%" });
            });
            sharedIndex = nextIndex;
            isAnimating = false;
        }
    });

    groups.forEach(group => {
        const h1s = group.querySelectorAll("h1");
        const current = h1s[sharedIndex];
        const next = h1s[nextIndex];
        gsap.set(next, { top: "100%" });
        tl.to(current, { top: "-100%" }, 0);
        tl.to(next, { top: "0%" }, 0);
    });
});

const btn = document.querySelector(".button");
if (btn) btn.addEventListener("click", (e) => { e.stopPropagation(); });

document.querySelectorAll(".links i").forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        if (icon.classList.contains("animating")) return;
        icon.classList.add("animating", "fa-bounce");
        setTimeout(() => icon.classList.remove("fa-bounce", "animating"), 1000);
    });
});

document.querySelector(".back-to-top").onclick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

raf();