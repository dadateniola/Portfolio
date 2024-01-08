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
        caseStudy: ['An online banking', 'app for the best and', 'top-notch user experience.'],
        desc: "Now principles discovered off increasing how reasonably middletons men. Add seems out man met plate court sense. His joy she worth truth given. All year feet led view went sake.",
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'client',
                        content: 'dada teniola emmanuel'
                    },
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
                        content: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Voluptates Qui, Vitae Neque Dolore Dolores Sit Ratione Illo Rerum Voluptatum, Rem, Quam Facere Optio! Beatae Tempora Tempore Asperiores Reiciendis Illum Laboriosam!'
                    },
                ]
            },
            {
                type: "image"
            },
            {
                head: 'details',
                heading: 'Lorem Ipsum, Dolor Sit Amet Consectetur Adipisicing Elit. Animi Esse Ipsum Suscipit Rem Porro, Fuga Saepe Incidunt Id Quo Iusto!',
                subHead: [
                    {
                        text: 'details',
                        content: 'Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.'
                    },
                    {
                        text: 'details',
                        content: 'Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.'
                    }
                ]
            },
            {
                type: "image"
            },
            {
                head: 'body',
                heading: 'Lorem Ipsum, Dolor Sit Amet Consectetur Adipisicing Elit. Animi Esse Ipsum Suscipit Rem Porro, Fuga Saepe Incidunt Id Quo Iusto!',
                subHead: [
                    {
                        text: 'details',
                        content: 'Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.'
                    }
                ]
            },
            {
                type: "image"
            },
        ]
    },
    {
        name: "stacks",
        folder: "stacks",
        color: "#349B92",
        type: "web development",
        caseStudy: ['a digital experience', 'rooted in a strong story', 'and unique brand purpose.'],
        desc: "Difficulty on insensible reasonable in. From as went he they. Preference themselves me as thoroughly partiality considered on in estimating. Middletons acceptance discovered projecting so is so or.",
        sections: [
            {
                head: 'details',
                subHead: [
                    {
                        text: 'client',
                        content: 'dada teniola emmanuel'
                    },
                    {
                        text: 'year',
                        content: '2022'
                    },
                    {
                        text: 'service',
                        content: 'web development'
                    },
                    {
                        text: 'purpose',
                        content: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit. Voluptates Qui, Vitae Neque Dolore Dolores Sit Ratione Illo Rerum Voluptatum, Rem, Quam Facere Optio! Reiciendis Illum Laboriosam!'
                    },
                ]
            },
            {
                type: "image"
            },
            {
                type: "image"
            },
            {
                head: 'details',
                heading: 'Lorem Ipsum, Dolor Sit Amet Consectetur Adipisicing Elit. Animi Esse Ipsum Suscipit Rem Porro, Fuga Saepe Incidunt Id Quo Iusto!',
                subHead: [
                    {
                        text: 'body',
                        content: 'Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.'
                    }
                ]
            },
            {
                type: "image"
            },
        ]
    }
]