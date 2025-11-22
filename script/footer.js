document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (footerPlaceholder) {
        const path = window.location.pathname;
        let basePath;
        let level = 0;

        if (path.includes("/pages/produtos/")) {
            basePath = "../../pages/footer.html";
            level = 2;
        } else if (path.includes("/pages/")) {
            basePath = "../pages/footer.html";
            level = 1;
        } else {
            basePath = "./pages/footer.html";
            level = 0;
        }

        fetch(basePath)
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;

                if (level > 0) {
                    const footerLinks = footerPlaceholder.querySelectorAll("a");

                    footerLinks.forEach(link => {
                        const originalHref = link.getAttribute("href");
                        if (!originalHref || originalHref === "#") return;

                        if (level === 2) {
                            if (originalHref === "index.html") {
                                link.setAttribute("href", "../../index.html");
                            } else {
                                link.setAttribute("href", "../../" + originalHref);
                            }
                        } else if (level === 1) {
                            if (originalHref === "index.html") {
                                link.setAttribute("href", "../index.html");
                            } else if (originalHref.includes("pages/")) {
                                link.setAttribute("href", originalHref.replace("pages/", ""));
                            }
                        }
                    });
                }
            })
            .catch(error => console.error(error));
    }
});