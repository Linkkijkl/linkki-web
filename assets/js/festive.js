/**
 * Sets festive theming on logo. 
 * @param {String} festive 
 */
const setFestive = (festive) => {
    // logo.svg -> logo-${festive}.svg
    // logo-dark.svg -> logo-${festive}-dark.svg
    // logo-light.svg -> logo-${festive}-light.svg
    for (const logo of document.querySelectorAll(".navbar-brand img")) {
        for (const suffix of ["-dark.svg", "-light.svg", ".svg"]) {
            if (logo.src.endsWith(suffix)) {
                logo.src = `${logo.src.replace(suffix, "")}-${festive}${suffix}`;
                break;
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const date = new Date();
    const month = date.getMonth() + 1; // Javascript's month starts from 0 and ends in 11
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