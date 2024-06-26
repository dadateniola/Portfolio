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

const PROJECT_SLIDERS = {};

const projects = [
    {
        name: "stacks",
        folder: "stacks",
        color: "#349B92",
        type: "web development",
        caseStudy: ['A centralized', 'platform for seamless', 'and efficient resource-sharing.'],
        desc: 'A final year project, to provide a centralized platform for the upload and retrieval of academic resources.',
        src: 'welcome back.png',
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'client',
                        content: 'babcock university',
                        link: 'https://www.babcock.edu.ng/'
                    },
                    {
                        text: 'year',
                        content: '2024'
                    },
                    {
                        text: 'service',
                        content: 'development and documentation'
                    },
                    {
                        text: 'purpose',
                        content: 'A final year project, to provide a centralized platform for the upload and retrieval of academic resources.',
                        no_cap: true
                    }
                ]
            },
            {
                type: "video",
                src: 'sign.mp4',
            },
            {
                type: "video",
                src: 'student.mp4',
            },
            {
                head: 'details',
                heading: 'Stacks stops students reliance on WhatsApp groups, Google Classroom, and other informal channels.',
                subHead: [
                    {
                        text: 'responsibilities',
                        content: 'Worked in a team of three<br><br>Developed both frontend and backend<br><br>Documented the system<br><br>Handled testing and maintenance',
                        no_cap: true
                    }
                ]
            },
            {
                type: "image",
                src: 'Mobile screens.png'
            },
            {
                head: 'features',
                subHead: [
                    {
                        text: "Resource Management",
                        content: "Lecturers can add and manage educational resources.",
                        no_cap: true
                    },
                    {
                        text: "User Management",
                        content: "Admins can add new users and edit their information.",
                        no_cap: true
                    },
                    {
                        text: "Request Handling",
                        content: "Admins can accept access requests from users.",
                        no_cap: true
                    },
                    {
                        text: "Additional Features",
                        content: "Includes search and filter, custom collections, and resource cataloging.",
                        no_cap: true
                    }
                ]
            },
            {
                type: "video",
                src: 'resources.mp4',
            },
            {
                type: "video",
                src: 'users.mp4',
            },
            {
                type: "video",
                src: 'requests.mp4',
            },
            {
                head: 'tools used',
                stack: ['HTML', 'CSS', 'Javascript', 'GSAP','Node JS', 'Express JS', 'MySQL', 'Photoshop']
            },
            {
                type: "image",
                src: '404.png'
            },
        ]
    },
    {
        name: "travis-hub",
        folder: "travis-hub",
        color: "#db0a40",
        type: "web development",
        caseStudy: ['Discover Travis', 'Scott: The icon unveiled.'],
        desc: 'A showcase of creativity and basic web development skills.',
        src: 'home.png',
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'client',
                        content: 'a student',
                    },
                    {
                        text: 'year',
                        content: '2023'
                    },
                    {
                        text: 'service',
                        content: 'web development'
                    },
                    {
                        text: 'purpose',
                        content: 'A showcase of creativity and basic web development skills.',
                        no_cap: true
                    }
                ]
            },
            {
                type: "video",
                src: 'all pages.mp4',
            },
            {
                type: "video",
                src: 'events.mp4',
            },
            {
                type: "image",
                src: 'events.png'
            },
            {
                type: "video",
                src: 'albums.mp4',
            },
            {
                head: 'tools used',
                stack: ['HTML', 'CSS', 'Javascript', 'GSAP']
            },
            {
                type: "image",
                src: 'albums.png'
            }
        ]
    },
    {
        name: "treasure-mart",
        folder: "treasure-mart",
        color: "#BE1614",
        type: "web development",
        caseStudy: ['Dynamic ecommerce', 'showcase with smooth', 'and interactive page transitons.'],
        desc: 'A personal project to showcase skills in animations and page transitions by developing a dynamic ecommerce site using Barba.js.',
        src: 'Treasure Mart.png',
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'client',
                        content: 'dada teniola (Me)',
                    },
                    {
                        text: 'year',
                        content: '2023'
                    },
                    {
                        text: 'service',
                        content: 'web development'
                    },
                    {
                        text: 'purpose',
                        content: 'A personal project to showcase skills in animations and page transitions by developing a dynamic ecommerce site using Barba.js.',
                        no_cap: true
                    }
                ]
            },
            {
                type: "video",
                src: 'page load.mp4',
            },
            {
                type: "video",
                src: 'sections.mp4',
            },
            {
                type: "image",
                src: 'products.png',
            },
            {
                type: "video",
                src: 'product listings.mp4',
            },
            {
                type: "video",
                src: 'product page.mp4',
            },
            {
                type: "video",
                src: 'sign pages.mp4',
            },
            {
                head: 'tools used',
                stack: ['HTML', 'CSS', 'Javascript', 'GSAP', 'Barba JS']
            },
        ]
    },
    {
        name: "tumble",
        folder: "tumble",
        color: "#50C878",
        type: "web development",
        caseStudy: ['An innovative video', 'streaming platform for an', 'unparalleled viewing experience.'],
        desc: 'Personal project taken after fullstack web development training.',
        src: 'tumble.png',
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'year',
                        content: '2022'
                    },
                    {
                        text: 'service',
                        content: 'Ui/Ux Design'
                    },
                    {
                        text: 'purpose',
                        content: 'Personal project taken after fullstack web development training.',
                        no_cap: true
                    },
                ]
            },
            {
                type: "video",
                src: 'home.mp4',
            },
            {
                type: "video",
                src: 'all pages.mp4',
            },
            {
                type: "video",
                src: 'video.mp4',
            },
            {
                head: 'tools used',
                stack: ['HTML', 'CSS', 'Javascript', 'Express JS', 'MySQL']
            },
        ]
    },
]