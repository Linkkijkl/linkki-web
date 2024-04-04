let icon;
let darkStyleObject;
let darkStyleParent;

const themeChangeEvent = new Event("onThemeChange");


/**
 * @returns true if current theme is dark
 */
const isThemeDark = () => {
    const dm = window.localStorage.getItem("darkmode");
    if (dm === null) return window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dm === "true";
}

/**
 * @param {boolean} dark 
 */
const setLogoDark = (dark) => {
    for (const logo of document.querySelectorAll(".navbar-brand img")) {
        for (const suffix of ["-dark.svg", "-light.svg", ".svg"]) {
            if (logo.src.endsWith(suffix)) {
                logo.src = `${logo.src.replace(suffix, "")}${dark ? "-dark.svg" : "-light.svg"}`;
                break;
            }
        }
    }
}


/**
 * @param {boolean} dark 
 */
const setDark = dark => {
    window.localStorage.setItem("darkmode", dark);
    const ds = document.querySelector("#darkstyle");
    if (dark && !ds) {
        darkStyleParent.appendChild(darkStyleObject.cloneNode());
        icon.className = "fas fa-2x fa-sun";
        setLogoDark(true);
    } else if (!dark && ds) {
        ds.remove();
        icon.className = "fas fa-2x fa-moon";
        setLogoDark(false);
    }
    document.getRootNode().dispatchEvent(themeChangeEvent);
}


const toggle = () => setDark(!isThemeDark());


const createButton = () => {
    const element = document.querySelector(".home-carousel .container, #heading-breadcrumbs .container");

    icon = document.createElement("i");
    icon.className = "fas fa-2x " + (isThemeDark() ? "fa-sun" : "fa-moon");

    let lightswitch = document.createElement("a");
    lightswitch.appendChild(icon);
    lightswitch.id = "lightswitch";
    lightswitch.href = "#"
    lightswitch.onclick = (event) => {
        event.preventDefault();
        toggle();
    };

    element.appendChild(lightswitch);
}


window.addEventListener("DOMContentLoaded", () => {
    createButton();
    const darkStyle = document.querySelector("#darkstyle");

    // As this sript has loaded, remove media-query based dark theme toggle
    darkStyle.media = "";

    darkStyleObject = darkStyle.cloneNode();
    darkStyleParent = darkStyle.parentElement;

    setDark(isThemeDark());
});
