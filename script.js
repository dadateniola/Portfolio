function fillImgs() {
    const projectBox = select(".project-box");

    if (!projectBox) return;

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

        projectBox.appendChild(project);
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
        this.isMobile = checkDeviceType().includes("mobile");
        this.page = select("main")?.id;
        if (this.page == "home") fillImgs();

        if (this.isMobile) {
            selectAll(".project").forEach(e => {
                e.classList.add("mobile");
            })
        }

        if (this.page == "projects" && !this.isMobile) {
            selectAll(".main-project").forEach(project => {
                project.addEventListener("mouseenter", (e) => {
                    carouselTimeline = PageSetup.startCarousel(e);
                });
                project.addEventListener("mouseleave", PageSetup.stopCarousel);
            })
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
    static startCarousel(e) {
        const parent = e instanceof Event ? e.target : e;
        const holder = selectWith(parent, ".main-project-img");
        const maxSlide = 3;
        const folder = parent.dataset?.folder || "stacks";

        const tl = gsap.timeline();

        var currentSlide = parseInt(holder.dataset?.slide) || slideStart;
        currentSlide = (currentSlide % maxSlide == 0) ? slideStart : currentSlide + 1;
        holder.dataset.slide = currentSlide;

        const img = create("img");
        img.src = `../assets/images/${folder}/${currentSlide}.png`;

        tl
            .set(img, { scale: 1.4, opacity: 0 })

            .call(() => holder.appendChild(img))

            .to(img, { opacity: 1 })
            .to(img, { scale: 1, duration: 3, ease: 'Expo.easeOut' }, '<')
            .call(() => {
                selectWith(holder, "img").remove();
                carouselTimeline = PageSetup.startCarousel(parent);
            })

        return tl;
    }

    static stopCarousel(e) {
        const parent = e instanceof Event ? e.target : e;
        const holder = selectWith(parent, ".main-project-img");
        const images = selectAllWith(holder, "img");
        const folder = parent.dataset?.folder || "stacks";
        const tl = gsap.timeline();

        carouselTimeline?.kill();

        const img = create("img");
        img.src = `../assets/images/${folder}/1.png`;

        holder.insertBefore(img, holder.children[0]);

        tl
            .to(images, { opacity: 0 })
            .call(() => {
                images.forEach(e => e.remove());
                holder.dataset.slide = 1;
            });
    }

    insertText(params = {}) {
        const { type, text, parent, before } = params;

        if (!type || !parent) return null;

        const element = create(type);
        element.innerHTML = text;

        if (before) parent.insertBefore(element, before);
        else parent.appendChild(element);
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

            .to(this.projectLine, { width: "100%", ease: "expo.out", duration: 1.5, delay: 0.5 })
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
        //Replace case study
        const heroIntro = select(".hero-intro");
        const { caseStudy } = matchedProject;

        for (let i = 0; i < caseStudy.length; i++) this.insertText({ type: "h1", text: caseStudy[i], parent: heroIntro });

        //Add page content
        const { sections } = matchedProject;
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const { subHead, type } = currentSection;

            const html = (type) ? this.handleImage() : this.handleText({ currentSection, subHead });

            this.insertText({ type: "section", text: html, parent: select("main"), before: select("footer") })
        }

        //Add images
        const images = selectAll(".intro-img");

        if (!matchedProject) return window.location.href = "./projects.html";

        images.forEach((parent, index) => {
            const img = create("img");
            img.src = `../assets/images/${contentParam}/${index + 1}.png`;

            parent.appendChild(img);
        })
    }

    handleImage() {
        return '<div class="intro-img img-here"></div>';
    }

    handleText({ currentSection, subHead }) {
        var fields = (currentSection.heading) ?
            `<div class="field-row">
                <h1>${currentSection.heading}</h1>
                </div>`
            : "";

        for (let i = 0; i < subHead?.length; i++) {
            fields += `
                <div class="field-row">
                    <p class="sub">${subHead[i].text}</p>
                    <p>${subHead[i].content}</p>
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
}

window.addEventListener("load", () => {
    // document.body.classList.add("overflow-h");

    // window.scrollTo({
    //     top: 0,
    //     behavior: "smooth"
    // });

    new PageSetup();
})