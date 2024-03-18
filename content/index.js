window.addEventListener("load", () => {

    // Randomize sponsor order
    let customers = document.querySelector(".customers .owl-wrapper");
    if (!customers) return;

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const sponsors = shuffle([...document.querySelectorAll(".customers .owl-item")]);
    for (const sponsor of sponsors) {
        customers.appendChild(sponsor)
    }
});
