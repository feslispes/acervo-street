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
    // Tornamos a função global (window) para que o produtos.js consiga chamá-la
    window.carregarCurtidas = function() {
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
    };

    // Delegação de eventos: funciona mesmo em produtos recém-criados pelo filtro
    document.addEventListener('click', function(e) {
        const btnCurtir = e.target.closest('.btn-curtir');
        if (btnCurtir) {
            const produtoCard = btnCurtir.closest('.produto-card');
            if (!produtoCard) return;
            
            const id = produtoCard.getAttribute('data-id');
            btnCurtir.classList.toggle('curtido');

            // Lógica de salvar/remover do Local Storage
            let curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
            
            if (btnCurtir.classList.contains('curtido')) {
                btnCurtir.innerText = "❤"; // Preenchido
                if (!curtidos.includes(id)) curtidos.push(id);
            } else {
                btnCurtir.innerText = "♡"; // Vazio
                curtidos = curtidos.filter(item => item !== id);
            }
            
            localStorage.setItem('produtosCurtidos', JSON.stringify(curtidos));
            window.atualizarContadorHeader(); // Atualiza o número no header instantaneamente
        }
    });

    window.carregarCurtidas();

    window.atualizarContadorHeader = function() {
        const curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
        const contador = document.getElementById('contador-curtidas');
        if (contador) {
            contador.innerText = curtidos.length;
        }
    };
    window.atualizarContadorHeader();

    // 3. Sistema do Side Drawer (Gaveta de Wishlist)
    const btnAbrirWishlist = document.getElementById('btn-curtidos');
    const btnFecharWishlist = document.getElementById('btn-fechar-wishlist');
    const sidebarWishlist = document.getElementById('wishlist-sidebar');
    const overlayWishlist = document.getElementById('wishlist-overlay');
    const listaContainer = document.getElementById('lista-favoritos');
    const sidebarFooter = document.getElementById('sidebar-footer');

    const toggleWishlist = () => {
        sidebarWishlist.classList.toggle('ativo');
        overlayWishlist.classList.toggle('ativo');
        // Só renderiza os itens se a gaveta estiver sendo aberta
        if (sidebarWishlist.classList.contains('ativo')) {
            renderizarWishlist();
        }
    };

    if (btnAbrirWishlist) btnAbrirWishlist.addEventListener('click', toggleWishlist);
    if (btnFecharWishlist) btnFecharWishlist.addEventListener('click', toggleWishlist);
    if (overlayWishlist) overlayWishlist.addEventListener('click', toggleWishlist); // Fecha ao clicar fora

    function renderizarWishlist() {
        const curtidos = JSON.parse(localStorage.getItem('produtosCurtidos')) || [];
        listaContainer.innerHTML = ''; // Limpa a lista antes de adicionar

        (curtidos.length === 0) ? sidebarFooter.innerHTML = '<p style="text-align: center; font-family: monospace;">Sua lista de desejos está vazia. 💔</p>' 
        : sidebarFooter.innerHTML = '<p style="text-align: center; font-family: monospace;">Gostou? Clique no item para ver detalhes e comprar!</p>';

        curtidos.forEach(id => {
            const produtoCard = document.querySelector(`.produto-card[data-id="${id}"]`);
            if (produtoCard) {
                const imgSrc = produtoCard.querySelector('img').src;
                const titulo = produtoCard.querySelector('.titulo-produto').textContent;
                const preco = produtoCard.querySelector('.preco-atual').textContent;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-wishlist';
                itemDiv.innerHTML = `
                    <img src="${imgSrc}" alt="${titulo}">
                    <div class="item-wishlist-info">
                        <h4>${titulo}</h4>
                        <p>${preco}</p></div>`;
                listaContainer.appendChild(itemDiv);
            }
        });
    }

    // 4. Filtro por Categorias
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', function() {
            botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
            this.classList.add('ativo');
            const categoria = this.getAttribute('data-categoria');
            if (typeof renderizarProdutos === 'function') renderizarProdutos(categoria);
        });
    });
    
});