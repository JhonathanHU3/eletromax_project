
document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        // Verifica se a URL atual contém "/pages/" para saber se está numa subpasta
        const isPagesFolder = window.location.pathname.includes("/pages/");

        // Se estiver na pasta pages, volta um nível (..). Se estiver na raiz, acessa direto (.).
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
        
        const currentPath = window.location.pathname; 
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
          
          const linkPath = new URL(link.href).pathname; 
          
          
          const isHomePage = (currentPath === '/' || currentPath.endsWith('/index.html'));
          const isLinkHomePage = (linkPath === '/' || linkPath.endsWith('/index.html'));

          if (isHomePage && isLinkHomePage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } 
         
          else if (!isHomePage && currentPath === linkPath) {
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