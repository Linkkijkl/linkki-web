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
    kahvikamera.src = src + "?" + randomHex;
    
    setInterval(updateKahvikamera, KAHVI_UPDATE_FREQ);
};


window.addEventListener("DOMContentLoaded", () => {
    kahvikamera = document.querySelector(".kahvikamera");
    if (kahvikamera) {
        setInterval(updateKahvikamera, KAHVI_UPDATE_FREQ);
    }
});
