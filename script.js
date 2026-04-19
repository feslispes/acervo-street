"use strict";
console.log("O script carregou com sucesso!");

document.addEventListener('DOMContentLoaded', () => {
    // 1. Filtro de Busca Inteligente
    const campoBusca = document.querySelector('#campo-busca');
    const listaProdutos = document.querySelectorAll('.produto-card');

    const limparTexto = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos e normaliza para comparação mais robusta(Expressão Regular)
    };

    if (campoBusca) {
        campoBusca.addEventListener('input', () => {
            const valorBusca = limparTexto(campoBusca.value);

            listaProdutos.forEach(produto => {
                const elementoTitulo = produto.querySelector('.titulo-produto');
                if (!elementoTitulo) return; 
                
                const nomeBruto = elementoTitulo.textContent;
                const nomeLimpo = limparTexto(nomeBruto); 
                
                produto.style.display = nomeLimpo.includes(valorBusca) ? "grid" : "none";
            });
        });
    }

    // 2. Sistema de Curtidas (LOCAL STORAGE)
    function carregarCurtidas() {
        const curtidosSalvos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];        
        
        document.querySelectorAll('.produto-card').forEach(produto => {
            const id = produto.getAttribute('data-id');
            const btn = produto.querySelector('.btn-curtir');

            if (btn) {
                if (curtidosSalvos.includes(id)) {
                    btn.classList.add('curtido');
                    btn.innerText = "❤"; 
                } else {
                    btn.classList.remove('curtido');
                    btn.innerText = "♡"; 
                }
            }
        });
    }

    document.querySelectorAll('.btn-curtir').forEach(botao => {
        botao.addEventListener('click', function() {
            const produtoCard = this.closest('.produto-card');
            if (!produtoCard) return;
            
            const id = produtoCard.getAttribute('data-id');
            this.classList.toggle('curtido');

            // Lógica de salvar/remover do Local Storage
            let curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
            
            if (this.classList.contains('curtido')) {
                this.innerText = "❤"; // Preenchido
                if (!curtidos.includes(id)) curtidos.push(id);
            } else {
                this.innerText = "♡"; // Vazio
                curtidos = curtidos.filter(item => item !== id);
            }
            
            localStorage.setItem('produtosCurtidos', JSON.stringify(curtidos));
            atualizarContadorHeader(); // Atualiza o número no header instantaneamente
        });
    });

    carregarCurtidas();

    function atualizarContadorHeader() {
    const curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
    const contador = document.getElementById('contador-curtidas');
    if (contador) {
        contador.innerText = curtidos.length;
    }
}
    atualizarContadorHeader();

});