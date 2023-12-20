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
                    <div class="project-text cap">
                        <p>name</p>
                        <p class="sub">type</p>
                    </div>`

        project.classList.add("project")
        project.innerHTML = html;

        select(".project-box").appendChild(project);
    }
}

fillImgs();