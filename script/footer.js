document.addEventListener("DOMContentLoaded", function() {
    fetch("/pages/footer.html") // Busca o arquivo footer.html na raiz do projeto
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o footer");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Erro:", error));
});