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

function fillImgs() {
    for (let i = 1; i < 6; i++) {
        const project = create('div');
        const html = `
                    <div class="project-img img-here">
                        <img src="./assets/images/project (${i + 1}).png" alt="project">
                    </div>
                    <div class="project-text">
                        <div class="project-type cap">
                            <p>UI/UX Design</p>
                        </div>
                        <div class="project-desc">
                            <p class="cap">name</p>
                            <p class="project-text-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam totam nulla a. Dicta.</p>
                        </div>
                    </div>`

        project.classList.add("project")
        project.innerHTML = html;

        select(".project-box").appendChild(project);
    }
}

fillImgs();


class PageSetup {
    constructor(params = {}) {
        Object.assign(this, params);
        this.init();
    }

    init() {
        if (this.checkDeviceType().includes("mobile")) {
            selectAll(".project").forEach(e => {
                e.classList.add("mobile");
            })
        }

        this.load();
    }

    // Methods
    checkDeviceType() {
        const mobileThreshold = 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (isTouchDevice && screenWidth <= mobileThreshold) {
            return "mobile";
        } else {
            return "pc";
        }
    }

    assignClones(element) {
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

    // Animations
    load() {
        const tl = gsap.timeline();
        const navLinks = selectAll("header a, header p, .projects h1");
        const heroText = selectAll(".hero-text p");
        const heroIntro = selectAll(".hero-intro h1");
        const projects = selectAll(".project");
        const projectLine = select(".project-line");
        const loaderBox = select(".loader-box");

        heroText.forEach(e => this.assignClones(e));
        heroIntro.forEach(e => this.assignClones(e));

        tl
            .set(navLinks, { opacity: 0 })
            .set(projects, { y: 100, opacity: 0 })
            .set(projectLine, { width: 0 })
            .to(loaderBox, { opacity: 0 })
            .call(() => select("loader").classList.add("hide"))
            .to(projectLine, { width: "100%", ease: "expo.out", duration: 1.5, delay: 0.5 })
            .to(".hero-text .anim-text", { yPercent: 0, stagger: 0.2 })
            .to(".hero-intro .anim-text", { yPercent: 0, stagger: 0.2 }, '<')
            .to(projects, { y: 0, opacity: 1 })
            .to(navLinks, { opacity: 1 }, '<')
            .call(() => document.body.classList.remove("overflow-h"))
    }
}

window.addEventListener("load", () => {
    document.body.classList.add("overflow-h");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    new PageSetup();
})