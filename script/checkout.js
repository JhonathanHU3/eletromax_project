class CheckoutManager {
    constructor() {
        this.carrinho = this.carregarCarrinho();
        this.inicializar();
    }

    inicializar() {
        this.renderizarResumos();
        this.configurarMascaras();
        this.configurarBotoesVoltar();
        
        if (this.carrinho.length > 0) {
            this.preencherParcelas();
        }

        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('blur', (e) => this.buscarCep(e.target.value));
        }
    }

    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            try {
                const state = JSON.parse(carrinhoSalvo);
                return state.items || [];
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    calcularTotal() {
        return this.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    renderizarResumos() {
        const total = this.calcularTotal();
        
        if (this.carrinho.length === 0) {
            window.location.href = '/pages/produtos.html';
            return;
        }

        const htmlItens = this.carrinho.map(item => `
            <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
                <div>
                    <small class="fw-bold">${item.quantidade}x</small> 
                    <small>${item.nome}</small>
                </div>
                <small class="fw-bold text-primary">R$ ${(item.preco * item.quantidade).toFixed(2)}</small>
            </div>
        `).join('');

        const htmlTotal = `
            <div class="mt-3 pt-2 border-top">
                <div class="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>R$ ${total.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between text-success">
                    <span>Frete:</span>
                    <span><strong>Grátis</strong></span>
                </div>
                <div class="d-flex justify-content-between mt-2 fs-5 fw-bold">
                    <span>Total:</span>
                    <span>R$ ${total.toFixed(2)}</span>
                </div>
            </div>
        `;

        ['resumo-pedido', 'resumo-pedido-pagamento'].forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<h3>Resumo</h3>${htmlItens}${htmlTotal}`;
            }
        });
    }

    preencherParcelas() {
        const total = this.calcularTotal();
        const select = document.getElementById('parcelas');
        if (!select) return;

        select.innerHTML = ''; 

        for (let i = 1; i <= 10; i++) {
            const valorParcela = total / i;
            const texto = `${i}x de R$ ${valorParcela.toFixed(2)} ${i === 1 ? 'à vista' : 'sem juros'}`;
            const option = document.createElement('option');
            option.value = i;
            option.text = texto;
            select.appendChild(option);
        }
    }

    validarDadosPessoais() {
        const inputs = document.querySelectorAll('#form-dados input[required], #form-dados select[required]');
        let formValido = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                formValido = false;
                input.classList.add('is-invalid'); 
            } else {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        });

        if (formValido) {
            this.irParaPagamento();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
            const primeiroInvalido = document.querySelector('#form-dados .is-invalid');
            if (primeiroInvalido) primeiroInvalido.focus();
        }
    }

    irParaPagamento() {
        document.getElementById('etapa-dados').style.display = 'none';
        const etapaPagamento = document.getElementById('etapa-pagamento');
        etapaPagamento.style.display = 'block';
        etapaPagamento.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    configurarBotoesVoltar() {
        const btnVoltar = document.getElementById('btn-voltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                document.getElementById('etapa-pagamento').style.display = 'none';
                document.getElementById('etapa-dados').style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    buscarCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            document.getElementById('endereco').placeholder = "Buscando...";
            
            fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('endereco').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                        
                        document.getElementById('endereco').classList.remove('is-invalid');
                        document.getElementById('numero').focus(); 
                    } else {
                        alert("CEP não encontrado.");
                    }
                    document.getElementById('endereco').placeholder = "";
                })
                .catch(() => alert("Erro ao buscar CEP."));
        }
    }

    configurarMascaras() {
        const tel = document.getElementById('telefone');
        if (tel) {
            tel.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                v = v.replace(/(\d)(\d{4})$/, "$1-$2");
                e.target.value = v;
            });
        }

        const cep = document.getElementById('cep');
        if (cep) {
            cep.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/^(\d{5})(\d)/, "$1-$2");
                e.target.value = v;
            });
        }

        const cartao = document.getElementById('numero-cartao');
        if (cartao) {
            cartao.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/(\d{4})/g, "$1 ").trim();
                e.target.value = v;
            });
        }

        const validade = document.getElementById('validade');
        if (validade) {
            validade.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/^(\d{2})(\d)/, "$1/$2");
                e.target.value = v;
            });
        }
    }

    prepararDadosEmail() {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const endereco = document.getElementById('endereco').value;
        const numero = document.getElementById('numero').value;
        const bairro = document.getElementById('bairro').value;
        const cidade = document.getElementById('cidade').value;
        const uf = document.getElementById('estado').value;
        const cep = document.getElementById('cep').value;

        const listaProdutos = this.carrinho.map(item => 
            `• ${item.quantidade}x ${item.nome} ...... R$ ${(item.preco * item.quantidade).toFixed(2)}`
        ).join('\n');

        const total = this.calcularTotal().toFixed(2);

        return {
            nome_cliente: nome,
            to_email: email,
            lista_produtos: listaProdutos,
            total: total,
            endereco_completo: `${endereco}, ${numero} - ${bairro}\n${cidade}/${uf} - CEP: ${cep}`
        };
    }


    mostrarTelaSucesso() {
        const overlay = document.getElementById('overlay-sucesso');
        if(overlay) {
           
            overlay.classList.remove('d-none');
            
          
            localStorage.removeItem('carrinho');

          
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 4000);
        }
    }

    
    fecharModal() {
        const overlay = document.getElementById('overlay-sucesso');
        if(overlay) {
            overlay.classList.add('d-none');
            window.location.href = '../index.html'; 
        }
    }

    finalizarCompra() {
        const inputsPagamento = document.querySelectorAll('#form-pagamento input[required], #form-pagamento select[required]');
        let formValido = true;

        inputsPagamento.forEach(input => {
            if (!input.value.trim()) {
                formValido = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!formValido) {
            alert('Por favor, preencha os dados do cartão.');
            return;
        }

        const btn = document.querySelector('#etapa-pagamento .btn-success');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Processando...';
        
        const dadosEmail = this.prepararDadosEmail();

        // SEUS IDs REAIS
        const serviceID = "service_h50dpl4";  
        const templateID = "template_c48ds7h"; 

        emailjs.send(serviceID, templateID, dadosEmail)
            .then(() => {
                this.mostrarTelaSucesso();
            })
            .catch((err) => {
                console.error('Erro ao enviar email:', err);
               
                this.mostrarTelaSucesso(); 
            });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.checkout = new CheckoutManager();
});