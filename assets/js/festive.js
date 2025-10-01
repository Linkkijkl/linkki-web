/**
 * Sets festive theming on logo. 
 * @param {String} festive 
 */
const setFestive = (festive) => {
    for (const logo of document.querySelectorAll(".navbar-brand .logo")) {
        const suffix = ".svg";
        logo.src = `${logo.src.replace(suffix, "")}-${festive}${suffix}`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const date = new Date();
    const month = date.getMonth() + 1; // Javascript's months start from 0 and end in 11
    const day = date.getDate();

    // Ylioppilaslakki
    if (month == 4 && day > 30 - 2 * 7 || month == 5 && day == 1) {
        setFestive("vappu");
    }

    // Pride month
    else if (month == 6) {
        setFestive("pride");
    }

    // Christmas
    else if (month == 12) {
        setFestive("joulu");
    }
});