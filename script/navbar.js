document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        const isPagesFolder = window.location.pathname.includes("/pages/");
        
        const basePath = isPagesFolder ? "../pages/navbar.html" : "./pages/navbar.html";

        fetch(basePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar o navbar: " + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                
                const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

                navLinks.forEach(link => {
                    const originalHref = link.getAttribute("href");

                    if (isPagesFolder) {
                        
                        if (originalHref === "index.html" || originalHref === "./index.html") {
                            link.setAttribute("href", "../index.html");
                        } 
                        else if (originalHref.includes("pages/")) {
                            link.setAttribute("href", originalHref.replace("pages/", "")); 
                            link.setAttribute("href", link.getAttribute("href").replace("./", ""));
                        }
                    }
                });
                const currentUrl = window.location.href;

                navLinks.forEach(link => {
                    if (link.href === currentUrl) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
                
            })
            .catch(error => {
                console.error(error);
                navbarPlaceholder.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar o menu.</p>";
            });
    }
});