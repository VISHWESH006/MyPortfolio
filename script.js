async function loadDesktopShery() {
    if (window.innerWidth <= 768) return;

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    try {
        // Load only if not already loaded
        if (!window.THREE) {
            await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/0.155.0/three.min.js");
        }

        if (!window.ControlKit) {
            await loadScript("https://cdn.jsdelivr.net/gh/automat/controlkit.js@master/bin/controlKit.min.js");
        }

        if (!window.Shery) {
            await loadScript("https://unpkg.com/sheryjs/dist/Shery.js");
        }

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

    } catch (err) {
        console.error("Failed to load Shery:", err);
    }
}

loadDesktopShery();

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

async function loadLeetCodeStats() {
    const LC_HANDLE = "vishwesh006";
    const statusEl = document.getElementById("lc-status");

    const setCardNum = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;

        const num = el.querySelector(".lc-card__num");
        if (!num) return;

        num.classList.remove("loading");
        num.textContent = val;
    };

    const setAllFailed = () => {
        document.querySelectorAll(".lc-card__num").forEach((el) => {
            el.classList.remove("loading");
            el.textContent = "—";
        });
    };

    document.querySelectorAll(".lc-card__num").forEach((el) => el.classList.add("loading"));

    try {
        const CACHE_KEY = `leetcode_${LC_HANDLE}`;
        const CACHE_TIME_KEY = `leetcode_time_${LC_HANDLE}`;
        const CACHE_DURATION = 6 * 60 * 60 * 1000;

        let stats;
        const now = Date.now();
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        if (cachedData && cachedTime && now - Number(cachedTime) < CACHE_DURATION) {
            console.log("Using cached LeetCode data");
            stats = JSON.parse(cachedData);
        } else {
            console.log("Fetching live LeetCode data...");

            const res = await fetch(`/api/leetcode?username=${encodeURIComponent(LC_HANDLE)}`, {
                cache: "no-store"
            });

            console.log("LeetCode response status:", res.status);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();
            console.log("LeetCode response", json);

            stats = json.stats;
            console.log(stats);

            if (!stats) {
                throw new Error("No LeetCode stats returned");
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
            localStorage.setItem(CACHE_TIME_KEY, now.toString());
        }

        setCardNum("lc-solved", (stats.totalSolved ?? 0).toLocaleString());
        setCardNum("lc-easy", (stats.easySolved ?? 0).toLocaleString());
        setCardNum("lc-medium", (stats.mediumSolved ?? 0).toLocaleString());
        setCardNum("lc-hard", (stats.hardSolved ?? 0).toLocaleString());
        setCardNum("lc-acceptance", `${stats.acceptRate ?? 0}%`);

        const streakValue = Number(stats.streak);
        setCardNum("lc-rank",
            Number.isFinite(streakValue) && streakValue >= 0
                ? `#${streakValue.toLocaleString()}`
                : "—"
        );

        if (statusEl) {
            statusEl.textContent = "live data";
        }
    } catch (error) {
        console.error(error);

        if (statusEl) {
            statusEl.textContent = "unavailable";
        }

        setAllFailed();
    }
}

loadLeetCodeStats();

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