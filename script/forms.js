document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Solicitação enviada com sucesso! Em breve entraremos em contato.');
      this.reset();
    });