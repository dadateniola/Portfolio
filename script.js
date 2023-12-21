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