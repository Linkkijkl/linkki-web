const toggle = () => {
    console.log("Theme toggle");
};

const createButton = () => {
    const element = document.querySelector(".home-carousel, #heading-breadcrumbs");

    let icon = document.createElement("i");
    icon.className = "fas fa-2x fa-sun";

    let lightswitch = document.createElement("a");
    lightswitch.appendChild(icon);
    lightswitch.style = "position: absolute; top: 10px; right: 10px;";

    element.appendChild(lightswitch);
}

window.addEventListener("load", () => {
    createButton();
});
