const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const selectWith = (p, e) => p.querySelector(e);
const selectAllWith = (p, e) => p.querySelectorAll(e);
const create = (e) => document.createElement(e);
const root = (e) => getComputedStyle(select(":root")).getPropertyValue(e);
const getStyle = (e, style) => window.getComputedStyle(e)[style];

const preventDefault = (event) => event.preventDefault();
const disableLinksAndBtns = (condition = false) => {
    selectAll('a, button').forEach((element) => {
        if (condition) {
            element.setAttribute('disabled', 'true');

            if (element.tagName === 'A') {
                element.dataset.href = element.href;
                element.addEventListener('click', preventDefault);
            }
        } else {
            selectAll('a, button').forEach((element) => {
                element.removeAttribute('disabled');

                if (element.tagName === 'A') {
                    element.setAttribute('href', element.dataset.href);
                    element.removeEventListener('click', preventDefault);
                }
            });
        }
    });
}

const checkDeviceType = () => {
    const mobileThreshold = 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (isTouchDevice && screenWidth <= mobileThreshold) {
        return "mobile";
    } else {
        return "pc";
    }
}

const assignClones = (element) => {
    const tagName = element.tagName;
    const tag = create(tagName);

    tag.innerHTML = element.innerHTML;
    tag.classList.add("anim-text");

    gsap.set(tag, { yPercent: 100 })

    element.classList.add("overflow-h");
    element.innerHTML = "";
    element.appendChild(tag);

    return tag;
}

gsap.registerPlugin(ScrollTrigger);

const slideStart = 1;
var carouselTimeline;

const projects = [
    {
        name: "bank-infinity",
        folder: "bank-infinity",
        color: "#98F270",
        type: "UI/UX design",
        desc: "Now principles discovered off increasing how reasonably middletons men. Add seems out man met plate court sense. His joy she worth truth given. All year feet led view went sake.",
    },
    {
        name: "stacks",
        folder: "stacks",
        color: "#349B92",
        type: "web development",
        desc: "Difficulty on insensible reasonable in. From as went he they. Preference themselves me as thoroughly partiality considered on in estimating. Middletons acceptance discovered projecting so is so or."
    }
]