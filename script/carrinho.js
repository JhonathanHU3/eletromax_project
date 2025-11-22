class CarrinhoCompras {
    constructor() {
        this.carrinho = this.carregarCarrinho();
        this.inicializar();
    }

    inicializar() {
        this.atualizarBadgeCarrinho();
        this.configurarEventos();
    }

    configurarEventos() {
      
        document.addEventListener('click', (e) => {
            
            const btnComprar = e.target.classList.contains('comprar') ? e.target : e.target.closest('.comprar');
            
            if (btnComprar) {
                e.preventDefault(); 
                this.adicionarProdutoDoHTML(btnComprar);
            }
        });

        
        const btnCarrinho = document.getElementById('btn-carrinho');
        if (btnCarrinho) {
            btnCarrinho.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirCarrinho();
            });
        }
    }

 
    adicionarProdutoDoHTML(elemento) {
        let produto = {};

       
        if (elemento.dataset.nome) {
            produto = {
        
                id: elemento.dataset.nome.toLowerCase().replace(/\s+/g, '-'), 
                nome: elemento.dataset.nome,
                preco: parseFloat(elemento.dataset.preco),
                imagem: elemento.dataset.imagem,
                quantidade: 1
            };
        } 
       
        else {
            const card = elemento.closest('.card');
            if (!card) return;

            const nome = card.querySelector('h2') ? card.querySelector('h2').textContent : 'Produto sem nome';
            const precoElement = card.querySelector('.amount');
            const preco = precoElement ? parseFloat(precoElement.textContent.replace(',', '.')) : 0;
            const imgElement = card.querySelector('img');

            produto = {
                id: nome.toLowerCase().replace(/\s+/g, '-'),
                nome: nome,
                preco: preco,
                imagem: imgElement ? imgElement.src : '',
                quantidade: 1
            };
        }

        this.adicionarAoCarrinho(produto);
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    }

    adicionarAoCarrinho(produto) {
       
        const itemExistente = this.carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            this.carrinho.push(produto);
        }

        this.salvarCarrinho();
        this.atualizarBadgeCarrinho();
    }

    removerDoCarrinho(id) {
       
        this.carrinho = this.carrinho.filter(item => String(item.id) !== String(id));
        this.salvarCarrinho();
        this.atualizarBadgeCarrinho();
        this.renderizarCarrinho();
    }

    atualizarQuantidade(id, novaQuantidade) {
        if (novaQuantidade <= 0) {
            this.removerDoCarrinho(id);
            return;
        }

        const item = this.carrinho.find(item => String(item.id) === String(id));
        if (item) {
            item.quantidade = novaQuantidade;
            this.salvarCarrinho();
            this.renderizarCarrinho();
        }
    }

    calcularTotal() {
        return this.carrinho.reduce((total, item) => 
            total + (item.preco * item.quantidade), 0
        );
    }

    calcularQuantidadeTotal() {
        return this.carrinho.reduce((total, item) => 
            total + item.quantidade, 0
        );
    }

    salvarCarrinho() {
        const carrinhoState = {
            items: this.carrinho,
            timestamp: Date.now()
        };
        localStorage.setItem('carrinho', JSON.stringify(carrinhoState));
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            try {
                const state = JSON.parse(carrinhoSalvo);
                return state.items || [];
            } catch (e) {
                console.error("Erro ao carregar carrinho", e);
                return [];
            }
        }
        return [];
    }

    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
        this.atualizarBadgeCarrinho();
        this.renderizarCarrinho();
    }

    atualizarBadgeCarrinho() {
        const badge = document.getElementById('carrinho-badge');
        const quantidade = this.calcularQuantidadeTotal();
        
        if (badge) {
            badge.textContent = quantidade;
            badge.style.display = quantidade > 0 ? 'flex' : 'none';
        }
    }

    abrirCarrinho() {
        window.location.href = '/pages/carrinho.html';
    }

    renderizarCarrinho() {
        const container = document.getElementById('carrinho-items');
        if (!container) return; 

        if (this.carrinho.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x" style="font-size: 64px; color: #ccc;"></i>
                    <h3 class="mt-3">Seu carrinho está vazio</h3>
                    <p class="text-muted">Adicione produtos para começar suas compras</p>
                    <a href="/pages/produtos.html" class="btn btn-primary mt-2">
                        Continuar Comprando
                    </a>
                </div>
            `;
            this.atualizarResumo();
            return;
        }

        container.innerHTML = this.carrinho.map(item => `
            <div class="d-flex align-items-center border-bottom py-3 gap-3">
                <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: 80px; object-fit: contain;">
                
                <div class="flex-grow-1">
                    <h5 class="mb-1">${item.nome}</h5>
                    <p class="text-primary fw-bold mb-0">R$ ${item.preco.toFixed(2)}</p>
                </div>

                <div class="d-flex align-items-center border rounded">
                    <button class="btn btn-sm btn-light border-0 px-2" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade - 1})">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span class="px-2 fw-bold">${item.quantidade}</span>
                    <button class="btn btn-sm btn-light border-0 px-2" onclick="carrinho.atualizarQuantidade('${item.id}', ${item.quantidade + 1})">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>

                <div class="fw-bold text-end" style="min-width: 80px;">
                    R$ ${(item.preco * item.quantidade).toFixed(2)}
                </div>

                <button class="btn btn-outline-danger btn-sm ms-2" onclick="carrinho.removerDoCarrinho('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        this.atualizarResumo();
    }

    atualizarResumo() {
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        
        const total = this.calcularTotal();
        
        
        const valorFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        if (subtotalElement) subtotalElement.textContent = valorFormatado;
        if (totalElement) totalElement.textContent = valorFormatado;
    }

    irParaCheckout() {
        if (this.carrinho.length === 0) {
            this.mostrarNotificacao('Adicione produtos ao carrinho primeiro!', 'warning');
            return;
        }
        window.location.href = '/pages/checkout.html';
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacaoExistente = document.querySelector('.notificacao-toast');
        if (notificacaoExistente) notificacaoExistente.remove();

        const notificacao = document.createElement('div');
        notificacao.className = `notificacao-toast position-fixed top-0 end-0 m-3 p-3 rounded shadow text-white ${tipo === 'success' ? 'bg-success' : 'bg-warning'}`;
        notificacao.style.zIndex = '9999';
        notificacao.style.transition = 'opacity 0.3s ease';
        notificacao.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi ${tipo === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.style.opacity = '0';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }
}

// Inicialização
const carrinho = new CarrinhoCompras();