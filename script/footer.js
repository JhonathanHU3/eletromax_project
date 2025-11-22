document.addEventListener("DOMContentLoaded", function() {
const footerPlaceholder = document.getElementById("footer-placeholder");

    if (footerPlaceholder) {
        const isPagesFolder = window.location.pathname.includes("/pages/");
        const basePath = isPagesFolder ? "../pages/footer.html" : "./pages/footer.html";

        fetch(basePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar o footer: " + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                if (isPagesFolder) {
                    const footerLinks = footerPlaceholder.querySelectorAll("a");

                    footerLinks.forEach(link => {
                        const originalHref = link.getAttribute("href");
            
                        if (!originalHref || originalHref === "#") return;

                        if (originalHref === "index.html" || originalHref === "./index.html") {
                            link.setAttribute("href", "../index.html");
                        } 
                        else if (originalHref.includes("pages/")) {
                            link.setAttribute("href", originalHref.replace("pages/", ""));
                            link.setAttribute("href", link.getAttribute("href").replace("./", ""));
                        }
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
});