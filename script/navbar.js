document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        const path = window.location.pathname;
        let basePath;
        let level = 0;

        if (path.includes("/pages/produtos/")) {
            basePath = "../../pages/navbar.html";
            level = 2;
        } else if (path.includes("/pages/")) {
            basePath = "../pages/navbar.html";
            level = 1;
        } else {
            basePath = "./pages/navbar.html";
            level = 0;
        }

        fetch(basePath)
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;

                const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
                const navbarBrand = document.querySelector('.navbar-brand');

                const fixLink = (link) => {
                    const originalHref = link.getAttribute("href");
                    if (!originalHref) return;

                    if (level === 2) {
                        if (originalHref === "index.html" || originalHref === "./index.html") {
                            link.setAttribute("href", "../../index.html");
                        } else if (originalHref.includes("pages/")) {
                            link.setAttribute("href", "../../" + originalHref);
                        }
                    } else if (level === 1) {
                        if (originalHref === "index.html" || originalHref === "./index.html") {
                            link.setAttribute("href", "../index.html");
                        } else if (originalHref.includes("pages/")) {
                            link.setAttribute("href", originalHref.replace("pages/", ""));
                            link.setAttribute("href", link.getAttribute("href").replace("./", ""));
                        }
                    }
                };

                navLinks.forEach(fixLink);
                if (navbarBrand) fixLink(navbarBrand);

                const currentUrl = window.location.href;
                navLinks.forEach(link => {
                    if (link.href === currentUrl) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            })
            .catch(error => console.error(error));
    }
});