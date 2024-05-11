class Slider {
    constructor(params = {}) {
        Object.assign(this, params);
        this.init();
    }

    init() {
        if (!this?.folder) return;

        const [data] = projects.filter(item => item.folder == this.folder);

        this.intro = `../assets/images/${this.folder}/${data.src}`;
        this.project = select(`[data-folder="${this.folder}"]`);

        const slides = data.sections.filter(({ type }) => type === 'image').map(({ src }) => `../assets/images/${this.folder}/${src}`);

        this.loadAllImages({ slides });
    }

    async loadAllImages(data = {}) {
        const { slides } = data;

        try {
            const images = await Promise.all(slides.map(Slider.loadImage));

            images.forEach(img => PROJECT_SLIDERS[this.folder].push(img));

            this.project.classList.remove("loading");

            if (!images.length) return;

            this.project.addEventListener("mouseenter", (e) => {
                carouselTimeline = Slider.startCarousel(e);
            });
            this.project.addEventListener("mouseleave", Slider.stopCarousel);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    static loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;

            img.onload = () => resolve(img);
            img.onerror = () => reject(`Failed to load image: ${src}`);
        });
    }

    static startCarousel(e) {
        const parent = e instanceof Event ? e.target : e;
        const slider = selectWith(parent, ".main-project-img");
        const currentSlide = selectWith(slider, "img");

        const folder = parent.dataset?.folder;

        if (!folder) return console.warn("Couldn't find images");

        const max = PROJECT_SLIDERS[folder].length - 1;

        const currentSlideIndex = parseInt(slider.getAttribute("data-index")) || 0;
        const nextSlideIndex = ((currentSlideIndex + 1) > max) ? 0 : currentSlideIndex + 1;
        const nextSlide = PROJECT_SLIDERS[folder][nextSlideIndex].cloneNode();

        const tl = gsap.timeline();

        tl
            .set(nextSlide, { scale: 1.4, opacity: 0 })

            .call(() => slider.appendChild(nextSlide))

            .to(nextSlide, { opacity: 1, duration: 0.3 })
            .to(nextSlide, { scale: 1, duration: 2.5, ease: 'Expo.easeOut' }, '<')
            .call(() => {
                slider.setAttribute("data-index", nextSlideIndex);
                selectWith(parent, "img").remove();
                carouselTimeline = Slider.startCarousel(parent);
            })

        return tl;
    }

    static stopCarousel(e) {
        const parent = e instanceof Event ? e.target : e;
        const slider = selectWith(parent, ".main-project-img");
        const slides = selectAllWith(slider, "*");

        const folder = parent.dataset?.folder;

        if (!folder) return console.warn("Couldn't find images");

        carouselTimeline?.kill();

        const firstSlide = PROJECT_SLIDERS[folder][0].cloneNode();
        gsap.set(firstSlide, { opacity: 1, scale: 1 })
        slider.insertBefore(firstSlide, slider.children[0]);

        const tl = gsap.timeline();

        tl
            .to(slides, { opacity: 0 })
            .call(() => {
                slider.setAttribute("data-index", 0);
                slides.forEach(e => e.remove())
            });
    }
}

class PageSetup {
    constructor(params = {}) {
        Object.assign(this, params);
        this.init();
    }

    parameters() {
        this.navLinks = selectAll("header a, header p, .projects h1");
        this.heroText = selectAll(".hero-text p");
        this.heroIntro = selectAll(".hero-intro h1");
        this.projects = selectAll(".project, .main-project, .intro-img");
        this.projectLine = select(".project-line");
        this.loader = select(".loader-box");
    }

    init() {
        const date = new Date();
        const year = select("[data-year]");

        if (year) year.innerHTML = '©' + date.getFullYear();

        this.isMobile = checkDeviceType().includes("mobile");
        this.page = select("main")?.id;

        if (this.page == "home") {
            this.selectedProjects();
        }

        if (this.isMobile) {
            selectAll(".project").forEach(e => {
                e.classList.add("mobile");
            })
        }

        if (this.page == "projects") {
            this.projectList();
        }

        if (this.page == "details") {
            const urlParams = new URLSearchParams(window.location.search);
            const contentParam = urlParams.get('content');
            const matchedProject = projects.find(project => project.name === contentParam);

            this.loadContent(contentParam, matchedProject);
        }

        this.parameters();

        this.load();
    }


    //Methods
    insertText(params = {}) {
        const { type, text, parent, before } = params;

        if (!type || !parent) return null;

        const element = create(type);
        element.innerHTML = text;

        if (before) parent.insertBefore(element, before);
        else parent.appendChild(element);
    }

    selectedProjects() {
        const projectBox = select(".project-box");

        if (!projectBox) return;

        for (const project of projects) {
            const div = create('a');
            const { folder, src, type, name, desc } = project;
            const image = {
                id: folder + Date.now(),
                src: `../assets/images/${folder}/${src}`,
            }

            const html = `
                <div class="project-img img-here">
                    <div class="pulsate" data-identifier="${image.id}"></div>
                </div>
                <div class="project-text">
                    <div class="project-type cap">
                        <p>${type}</p>
                    </div>
                    <div class="project-desc">
                        <p class="cap">${name.split("-").join(" ")}</p>
                        <p class="project-text-desc">${desc}</p>
                    </div>
                </div>
            `;

            div.href = `./pages/details.html?content=${folder}`
            div.classList.add("project");
            div.innerHTML = html;

            projectBox.appendChild(div);

            PageSetup.loadimages(image);
        }
    }

    static loadimages(data = {}) {
        const { id, src, run } = data;

        const image = new Image();
        image.src = src;

        image.onload = () => {
            const placeholder = select(`[data-identifier='${id}']`);
            placeholder.replaceWith(image);

            if (run) run(image);
        };

        image.onerror = () => {
            const placeholder = select(`[data-identifier='${id}']`);
            placeholder.textContent = 'Image not available';

            console.error(`Failed to load image: ${src}`);
        };
    }

    projectList() {
        const mainProjectBox = select(".main-project-box");

        if (!mainProjectBox) return;

        for (const project of projects) {
            const div = create('div');
            const { folder, src, type, name, desc, color } = project;
            const image = {
                id: folder + Date.now(),
                src: `../assets/images/${folder}/${src}`,
                run: (img) => {
                    PROJECT_SLIDERS[folder] = [img];
                    
                    if(this.isMobile) div.classList.remove("loading")
                    else new Slider({ folder });
                }
            }

            const html = `
                <div class="main-project-img img-here">
                    <div class="pulsate" data-identifier="${image.id}"></div>
                </div>
                <div class="main-project-text">
                    <div>
                        <h1>${name.split("-").join(" ")}</h1>
                        <p>${desc}</p>
                    </div>
                    <div class="main-project-cta">
                        <a class="main-cta" href="./details.html?content=${folder}">view project</a>
                        <span class="main-type">${type}</span>
                    </div>
                </div>
            `;

            div.classList.add("main-project", "loading");
            div.style.setProperty('--color', color);
            div.setAttribute("data-folder", folder);
            div.innerHTML = html;

            mainProjectBox.appendChild(div);

            PageSetup.loadimages(image);
        }
    }


    //Animations
    load() {
        const tl = gsap.timeline();

        this.heroText.forEach(e => assignClones(e));
        this.heroIntro.forEach(e => assignClones(e));

        tl
            .set(this.navLinks, { opacity: 0 })
            .set(this.projects, { y: 100, opacity: 0 })
            .set(this.projectLine, { width: 0 })

            .to(this.loader, { opacity: 0 })

            .call(() => select("loader").classList.add("hide"))

            .to(this.projectLine, { width: "100%", ease: "expo.out", duration: 1 })
            .to(".hero-text .anim-text", { yPercent: 0, stagger: 0.2 })
            .to(".hero-intro .anim-text", { yPercent: 0, stagger: 0.2 }, '<')
            .to(this.projects, { y: 0, opacity: 1 }, '-=0.5')
            .to(this.navLinks, { opacity: 1 }, '<')

            .call(() => {
                document.body.classList.remove("overflow-h");
                this.scroll();
            })
    }

    scroll() {
        selectAll(".scroll-anim").forEach(parent => {
            const textTl = gsap.timeline();
            const text = selectAllWith(parent, "h1, p, a, span");
            const projectImg = selectWith(parent, ".main-project-img");

            textTl.set(text, { opacity: 0, y: 30 });

            if (projectImg) {
                textTl.set(projectImg, { opacity: 0 });
                textTl.to(projectImg, { opacity: 1 });
            }

            textTl.to(text, { opacity: 1, y: 0, stagger: 0.1 }, "<");

            ScrollTrigger.create({
                trigger: parent,
                animation: textTl,
                start: 'top 70%',
            })
        })

        if (this.page == "home") {
            const tl = gsap.timeline();
            const skills = selectAll(".skill");
            const skillHeads = selectAll(".skills-head")

            tl
                .set(skillHeads, { opacity: 0, y: 20 })
                .set(skills, { opacity: 0 })

                .to(skillHeads, { opacity: 1, y: 0, stagger: 0.1 })
                .to(skills, { opacity: 1, stagger: 0.05 })

            ScrollTrigger.create({
                trigger: ".skills",
                animation: tl,
                start: 'top 70%',
            })
        }
    }

    //Powerhouse
    loadContent(contentParam, matchedProject) {
        if (!matchedProject) return window.location.href = "./projects.html";

        //Replace case study
        const main = select("main#details");
        const heroIntro = select(".hero-intro");
        const { caseStudy, src } = matchedProject;

        for (let i = 0; i < caseStudy.length; i++) this.insertText({ type: "h1", text: caseStudy[i], parent: heroIntro });

        //Add intro image
        const image = {
            id: 'folder-1234',
            src: `../assets/images/${contentParam}/${src}`,
        }
        PageSetup.loadimages(image);

        //Add page content
        const { sections } = matchedProject;
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const { subHead, stack, type, src, color } = currentSection;

            const html = (stack) ? this.handleStack({ stack, head: currentSection?.head }) :
                (type) ?
                    this.handleImgVid({ src, type, folder: contentParam, color }) :
                    this.handleText({ currentSection, subHead });

            this.insertText({ type: "section", text: html, parent: select("main"), before: select("footer") })
        }
    }

    handleImgVid(params = {}) {
        const { src, type, folder, color } = params;

        if (type == 'image') {
            const image = {
                id: folder + Date.now(),
                src: `../assets/images/${folder}/${src}`,
            }
            const html =  `
                <div class="intro-img img-here">
                    <div class="pulsate" data-identifier="${image.id}"></div>
                </div>
            `;

            PageSetup.loadimages(image);

            return html;
        } else if (type == 'video') {
            return `
                <div class="vid-here" style="--color: ${color}">
                    <video 
                        src="../assets/videos/${folder}/${src}" autoplay
                        muted
                        loop
                        playsinline
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        } else return '';
    }

    handleText({ currentSection, subHead }) {
        var fields = (currentSection.heading) ?
            `<div class="field-row">
                <h1>${currentSection.heading}</h1>
                </div>`
            : "";

        for (let i = 0; i < subHead?.length; i++) {
            const { text, no_cap, content, link } = subHead[i];
            const tag = link ? 'a' : 'p';

            fields += `
                <div class="field-row">
                    <p class="sub">${text}</p>
                    <${tag} 
                        ${link ? `href="${link}" target="_blank"` : ''}
                        ${no_cap ? 'class="no-cap"' : ''}
                    >
                        ${content}
                    </${tag}>
                </div>
                `
        }

        const html = `
            <div class="indent full flex">
                <div></div>
                <div class="indent full mt flex">
                    <h1 class="section-head">${currentSection?.head}</h1>
                    <div class="fields cap line-bm">
                        ${fields}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    handleStack(params = []) {
        const { stack, head } = params;
        var skills = '';

        for (const item of stack) {
            skills += `
                <div class="skill">
                    <div class="skill-img img-here">
                        <img src="../assets/icons/${item.toLowerCase()}.png" alt="skill">
                    </div>
                    <p>${item}</p>
                </div>
            `;
        }

        const html = `
            <div class="indent full flex stack-skills">
                <div></div>
                <div class="indent full mt flex">
                    <h1 class="section-head">${head}</h1>
                    <div class="skills-box">
                        <div class="skills-cont">
                            <div class="skills-row">
                                ${skills}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
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