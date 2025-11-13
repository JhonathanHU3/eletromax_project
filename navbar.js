

document.addEventListener("DOMContentLoaded", function() {
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  
  if (navbarPlaceholder) {
    fetch("navbar.html")
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
          
          
          const isHomePage = currentPath === '/' || currentPath.endsWith('/index.html');
          const isLinkHomePage = linkPath === '/' || linkPath.endsWith('/index.html');

          if (isHomePage && isLinkHomePage) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
          } else if (!isHomePage && currentPath.endsWith(linkPath) && linkPath !== '/') {
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