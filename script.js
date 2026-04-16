"use strict";
console.log("O script carregou com sucesso!");


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. FILTRO DE BUSCA INTELIGENTE ---
    const campoBusca = document.querySelector('#campo-busca');
    const listaProdutos = document.querySelectorAll('.produto');

    const limparTexto = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos e normaliza para comparação mais robusta(Expressão Regular)
    };


    if (campoBusca) {
        campoBusca.addEventListener('input', () => {
            const valorBusca = limparTexto(campoBusca.value);

            listaProdutos.forEach(produto => {
                const elementoH2 = produto.querySelector('h2');
                if (!elementoH2) return; 
                
                const nomeBruto = elementoH2.textContent;
                const nomeLimpo = limparTexto(nomeBruto); 
                
                
                produto.parentElement.style.display = nomeLimpo.includes(valorBusca) ? "block" : "none";
            });
        });
    }

    // --- 2. SISTEMA DE CURTIDAS (LOCAL STORAGE) ---
    function carregarCurtidas() {
        const curtidosSalvos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
        
        document.querySelectorAll('.produto').forEach(produto => {
            const id = produto.getAttribute('data-id');
            if (curtidosSalvos.includes(id)) {
                const btn = produto.querySelector('.btn-curtir');
                if (btn) {
                    btn.classList.add('curtido');
                    btn.innerText = "✅ Curtido";
                }
            }
        });
    }

    carregarCurtidas();

    document.querySelectorAll('.btn-curtir').forEach(botao => {
        botao.addEventListener('click', function() {
            const produtoCard = this.closest('.produto');
            if (!produtoCard) return;
            
            const id = produtoCard.getAttribute('data-id');
            
            // Alterna a classe visual
            this.classList.toggle('curtido');
            
            // Lógica de salvar/remover do Local Storage
            let curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
            
            if (this.classList.contains('curtido')) {
                this.innerText = "✅ Curtido";
                if (!curtidos.includes(id)) curtidos.push(id);
            } else {
                this.innerText = "❤️ Curtir";
                curtidos = curtidos.filter(item => item !== id);
            }
            
            localStorage.setItem('produtosCurtidos', JSON.stringify(curtidos));
        });
    });
});