
// Starts from top on refresh
// window.addEventListener("load", () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
// });



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


// Custom Cursor
var pagecontent = document.querySelector("#About");
var cursor = document.querySelector("#cursor");
var para = document.querySelector("#para");

document.addEventListener("mousemove", function (dets) {
    gsap.set(cursor, {
        xPercent: -50,
        yPercent: -50
    });
    gsap.to(cursor, {
        x: dets.clientX,
        y: dets.clientY,
        duration: 0.2
    });
});

pagecontent.addEventListener("mouseenter", function () {
    gsap.to(cursor, {
        scale: 1,
        opacity: 1
    })
});
pagecontent.addEventListener("mouseleave", function () {
    gsap.to(cursor, {
        scale: 0,
        opacity: 0
    })
});

para.addEventListener("mouseenter", function () {
    gsap.to(cursor, {
        scale: 0
    })
});
para.addEventListener("mouseleave", function () {
    gsap.to(cursor, {
        scale: 1
    })
});

const about = document.querySelector(".aboutme");
const maskText = document.querySelector(".about-mask");

document.addEventListener("mousemove", (e) => {
    const rect = about.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    maskText.style.clipPath = `circle(${cursor.offsetWidth / 2}px at ${x}px ${y}px)`;
});

about.addEventListener("mouseenter", function (dets) {
    cursor.style.zIndex = 0
});
about.addEventListener("mouseleave", function (dets) {
    cursor.style.zIndex = 1
});


const cursorText = document.querySelector("#cursor h2");
const aboutPara = document.querySelector(".para");

aboutPara.addEventListener("mouseenter", () => {
    cursorText.textContent = "";
});

aboutPara.addEventListener("mouseleave", () => {
    cursorText.textContent = "Play >";
});






// Hover image
var onespan = document.querySelector("#onespan");
var secondspan = document.querySelector("#secondspan");
var thirdspan = document.querySelector("#thirdspan");
var fourspan = document.querySelector("#fourspan");

onespan.addEventListener("mouseenter", function () {
    cursor.style.backgroundImage = "url('assets/images/computer_science.jpeg')";
    cursor.style.backgroundSize = "cover";
    cursor.style.backgroundPosition = "center";
    gsap.to(cursor, {
        scale: 1,
    })
});
onespan.addEventListener("mouseleave", function () {
    cursor.style.backgroundImage = "";
    gsap.to(cursor, {
        scale: 0,
    })
});


secondspan.addEventListener("mouseenter", function () {
    cursor.style.backgroundImage = "url('assets/images/automation.jpeg')";
    cursor.style.backgroundSize = "cover";
    cursor.style.backgroundPosition = "center";
    gsap.to(cursor, {
        scale: 1,
    })
});
secondspan.addEventListener("mouseleave", function () {
    cursor.style.backgroundImage = "";
    gsap.to(cursor, {
        scale: 0,
    })
});



thirdspan.addEventListener("mouseenter", function () {
    cursor.style.backgroundImage = "url('assets/images/technology.jpeg')";
    cursor.style.backgroundSize = "cover";
    cursor.style.backgroundPosition = "center";
    gsap.to(cursor, {
        scale: 1,
    })
});
thirdspan.addEventListener("mouseleave", function () {
    cursor.style.backgroundImage = "";
    gsap.to(cursor, {
        scale: 0,
    })
});



fourspan.addEventListener("mouseenter", function () {
    cursor.style.backgroundImage = "url('assets/images/ai.jpeg')";
    cursor.style.backgroundSize = "cover";
    cursor.style.backgroundPosition = "center";
    gsap.to(cursor, {
        scale: 1,
    })
});
fourspan.addEventListener("mouseleave", function () {
    cursor.style.backgroundImage = "";
    gsap.to(cursor, {
        scale: 0,
    })
});



// Video play logic
var video = document.querySelector("#video");
var videobtn = document.querySelector("#video-btn");

videobtn.addEventListener("click", function () {
    if (videobtn.innerText.trim() === "> PLAY") {
        video.style.zIndex = "9";
        videobtn.innerText = "PAUSE";
    }
    else {
        video.style.zIndex = "-1";
        videobtn.innerText = "> PLAY";
    }
});






const aboutSection = document.querySelector("#About");

// hide cursor on refresh
gsap.set(cursor, { scale: 0, opacity: 0 });

// when About section enters viewport
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



//logic to change text on click
const groups = document.querySelectorAll(".ele");

groups.forEach((group) => {
    const h1s = group.querySelectorAll("h1");
    let index = 0;
    let isAnimating = false;

    document.querySelector("#Achievement").addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;

        const current = h1s[index];
        const next = h1s[(index + 1) % h1s.length];
        gsap.set(next, { top: "100%" });

        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: "expo.inOut"
            },
            onComplete: () => {
                gsap.set(current, { top: "100%" });
                index = (index + 1) % h1s.length;
                isAnimating = false;
            }
        });

        tl.to(current, { top: "-100%" }, 0);

        tl.to(next, { top: "0%" }, 0);
    });
});

// prevent button clicks to changing text
const btn = document.querySelector(".button");

btn.addEventListener("click", (e) => {
    e.stopPropagation();
});




// logic for ABOUT section icons one-time hover animation
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





// back to top
document.querySelector(".back-to-top").onclick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });




// Smooth scroll
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

raf();