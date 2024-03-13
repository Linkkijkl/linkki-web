let kahvikamera = null;
const KAHVI_UPDATE_FREQ = 30_000;

function updateKahvikamera() {
    // Update image cirumventing browser cahe
    let src = kahvikamera.src;
    if (src.includes("?")) {
        src = src.split("?")[0];
    }
    const MAX_RANDOM_CHARS = 5;
    let randomHex = parseInt(Math.random() * (16 ** MAX_RANDOM_CHARS)).toString(16);
    kahvikamera.src = src += "?" + randomHex;
    
    setInterval(updateKahvikamera, KAHVI_UPDATE_FREQ);
};

let randomizeSponsorOrder = () => {
    let customers = document.querySelector(".customers .owl-wrapper");
    if (!customers) return;
    [...document.querySelectorAll(".customers .owl-item")]
        // FIXME: This is weighted random, the first elements have a bigger chance on staying on front.
        .sort((a, b) => 0.5 - Math.random())
        .forEach(sponsor => customers.appendChild(sponsor));
};

window.onload = () => {
    kahvikamera = document.querySelector(".kahvikamera");
    if (kahvikamera) {
        setInterval(updateKahvikamera, KAHVI_UPDATE_FREQ);
    }

    randomizeSponsorOrder();
};
