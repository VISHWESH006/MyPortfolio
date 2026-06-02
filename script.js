// ─── Shery Image Effect ───────────────────────────────────────────────────────
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


// ─── Custom Cursor ─────────────────────────────────────────────────────────────
var pagecontent = document.querySelector("#About");
var cursor = document.querySelector("#cursor");
var para = document.querySelector("#para");

// hide cursor on load
gsap.set(cursor, { scale: 0, opacity: 0 });

document.addEventListener("mousemove", function (dets) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.to(cursor, { x: dets.clientX, y: dets.clientY, duration: 0.2 });
});

pagecontent.addEventListener("mouseenter", function () {
    gsap.to(cursor, { scale: 1, opacity: 1 });
});
pagecontent.addEventListener("mouseleave", function () {
    gsap.to(cursor, { scale: 0, opacity: 0 });
});

para.addEventListener("mouseenter", function () {
    gsap.to(cursor, { scale: 0 });
});
para.addEventListener("mouseleave", function () {
    gsap.to(cursor, { scale: 1 });
});


// ─── About mask text effect ────────────────────────────────────────────────────
const about = document.querySelector(".aboutme");
const maskText = document.querySelector(".about-mask");

document.addEventListener("mousemove", (e) => {
    const rect = about.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    maskText.style.clipPath = `circle(${cursor.offsetWidth / 2}px at ${x}px ${y}px)`;
});

about.addEventListener("mouseenter", function () {
    cursor.style.zIndex = 0;
});
about.addEventListener("mouseleave", function () {
    cursor.style.zIndex = 1;
});


// ─── Cursor text toggle on para hover ─────────────────────────────────────────
const cursorText = document.querySelector("#cursor h2");
const aboutPara = document.querySelector(".para");

aboutPara.addEventListener("mouseenter", () => {
    cursorText.textContent = "";
});
aboutPara.addEventListener("mouseleave", () => {
    cursorText.textContent = "Play >";
});


// ─── Hover image on spans ──────────────────────────────────────────────────────
const spanImageMap = [
    { id: "#onespan", src: "assets/images/computer_science.jpeg" },
    { id: "#secondspan", src: "assets/images/automation.jpeg" },
    { id: "#thirdspan", src: "assets/images/technology.jpeg" },
    { id: "#fourspan", src: "assets/images/ai.jpeg" },
];

spanImageMap.forEach(({ id, src }) => {
    const el = document.querySelector(id);
    if (!el) return;

    el.addEventListener("mouseenter", () => {
        cursor.style.backgroundImage = `url('${src}')`;
        cursor.style.backgroundSize = "cover";
        cursor.style.backgroundPosition = "center";
        gsap.to(cursor, { scale: 1 });
    });

    el.addEventListener("mouseleave", () => {
        cursor.style.backgroundImage = "";
        gsap.to(cursor, { scale: 0 });
    });
});


// ─── Video play / pause ────────────────────────────────────────────────────────
var video = document.querySelector("#video");
var videobtn = document.querySelector("#video-btn");

videobtn.addEventListener("click", function () {
    if (videobtn.innerText.trim() === "> PLAY") {
        video.style.zIndex = "9";
        videobtn.innerText = "PAUSE";
    } else {
        video.style.zIndex = "-1";
        videobtn.innerText = "> PLAY";
    }
});


// ─── About section cursor visibility via IntersectionObserver ─────────────────
const aboutSection = document.querySelector("#About");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
        } else {
            gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
        }
    });
}, { threshold: 0.2 });

observer.observe(aboutSection);


// ─── Achievement section: synced text slide on click ──────────────────────────
// FIX: All .ele groups must share ONE global index so text rows and the
// Shery image effect (which also advances on each click) stay in sync.
const groups = document.querySelectorAll(".ele");
const totalSlides = groups.length > 0 ? groups[0].querySelectorAll("h1").length : 0;

let sharedIndex = 0;   // single source of truth for all groups
let isAnimating = false;

document.querySelector("#Achievement").addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex = (sharedIndex + 1) % totalSlides;

    const tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.inOut" },
        onComplete: () => {
            // After animation: snap current out of view so it won't flash back
            groups.forEach(group => {
                const h1s = group.querySelectorAll("h1");
                gsap.set(h1s[sharedIndex], { top: "100%" });
            });
            sharedIndex = nextIndex;
            isAnimating = false;
        }
    });

    // Animate every group simultaneously using the same shared index
    groups.forEach(group => {
        const h1s = group.querySelectorAll("h1");
        const current = h1s[sharedIndex];
        const next = h1s[nextIndex];

        gsap.set(next, { top: "100%" });

        tl.to(current, { top: "-100%" }, 0);
        tl.to(next, { top: "0%" }, 0);
    });
});

// Prevent button click from bubbling up to #Achievement and triggering slide
const btn = document.querySelector(".button");
btn.addEventListener("click", (e) => {
    e.stopPropagation();
});


// ─── About section icons: one-time bounce on hover ────────────────────────────
const icons = document.querySelectorAll(".links i");

icons.forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        if (icon.classList.contains("animating")) return;

        icon.classList.add("animating", "fa-bounce");

        setTimeout(() => {
            icon.classList.remove("fa-bounce", "animating");
        }, 1000);
    });
});


// ─── Back to top ──────────────────────────────────────────────────────────────
document.querySelector(".back-to-top").onclick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });


// ─── Smooth scroll (Lenis) ────────────────────────────────────────────────────
const lenis = new Lenis();

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

raf();