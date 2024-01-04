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
        this.projects = selectAll(".project, .main-project");
        this.projectLine = select(".project-line");
        this.loader = select(".loader-box");

        this.mainProjects = selectAll(".main-project");
    }

    init() {
        this.isMobile = checkDeviceType().includes("mobile");
        this.page = select("main")?.id;
        if (this.page == "home") fillImgs();

        this.parameters();

        if (this.isMobile) {
            selectAll(".project").forEach(e => {
                e.classList.add("mobile");
            })
        }

        if (this.page == "projects" && !this.isMobile) {
            this.mainProjects.forEach(project => {
                project.addEventListener("mouseenter", (e) => {
                    carouselTimeline = PageSetup.startCarousel(e);
                });
                project.addEventListener("mouseleave", PageSetup.stopCarousel);
            })
        }

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
}

window.addEventListener("load", () => {
    document.body.classList.add("overflow-h");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    new PageSetup();
})