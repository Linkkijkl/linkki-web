let icon;
let darkStyleObject;
let darkStyleParent;

const isDark = () => {
    const dm = window.localStorage.getItem("darkmode");
    if (dm === null) return window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dm === "true";
}


const setDark = dark => {
    const ds = document.querySelector("#darkstyle");
    if (dark && !ds) {
        darkStyleParent.appendChild(darkStyleObject.cloneNode());
        icon.className = "fas fa-2x fa-sun";
    } else if (!dark && ds) {
        ds.remove();
        icon.className = "fas fa-2x fa-moon";
    }
    window.localStorage.setItem("darkmode", dark);
}


const toggle = () => setDark(!isDark());


const createButton = () => {
    const element = document.querySelector(".home-carousel, #heading-breadcrumbs");

    icon = document.createElement("i");

    let lightswitch = document.createElement("a");
    lightswitch.appendChild(icon);
    lightswitch.style = "position: absolute; top: 10px; right: 10px;";
    lightswitch.onclick = (event) => {
        event.preventDefault();
        toggle();
    };

    element.appendChild(lightswitch);
}


window.addEventListener("DOMContentLoaded", () => {
    createButton();

    const darkStyle = document.querySelector("#darkstyle");
    darkStyle.media = "";
    darkStyleObject = darkStyle.cloneNode();
    darkStyleParent = darkStyle.parentElement;

    setDark(isDark());
});
