window.onload = () => {
    // Randomize sponsor order
    
    let customers = document.querySelector(".customers .owl-wrapper");
    if (!customers) return;
    [...document.querySelectorAll(".customers .owl-item")]
        // FIXME: This is weighted random, the first elements have a bigger chance on staying on front.
        .sort((a, b) => 0.5 - Math.random())
        .forEach(sponsor => customers.appendChild(sponsor));
};
