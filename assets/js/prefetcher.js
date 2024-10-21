document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach((a) => {
        if (["/", "#"].includes(a.href)) return;
        if (a.href.startsWith("mailto")) return;

        a.addEventListener("mouseover", () => {
            const elem = document.createElement("link");
            elem.rel = "prefetch";
            elem.href = a.href;
            document.head.appendChild(elem);
        });
    });
});
