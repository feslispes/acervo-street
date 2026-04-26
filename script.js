"use strict";
console.log("O script carregou com sucesso!");

document.addEventListener('DOMContentLoaded', () => {

    // 1. Função que desenha os produtos na tela
    function renderizarProdutos(categoriaFiltro = 'todos') {
    const vitrine = document.getElementById('vitrine-produtos');
    if (!vitrine) return; // Evita erro em páginas que não possuem a vitrine
    vitrine.innerHTML = ""; 

    const produtosFiltrados = categoriaFiltro === 'todos' ? produtosAcervo : produtosAcervo.filter(p => p.categoria === categoriaFiltro);

    produtosFiltrados.forEach(produto => {
        const cardHTML = `
            <article class="produto-card" data-id="${produto.id}" data-categoria="${produto.categoria}">
                <div class="img-bg">
                    <a href="produtos.html?id=${produto.id}">
                        <img src="${produto.imagem}" alt="${produto.nome}"></a>
                    <button class="btn-curtir">♡</button>
                </div>
                <div class="info-produto">
                    <h3 class="titulo-produto">${produto.nome}</h3>
                    <div class="precos">
                        ${produto.precoAntigo ? `<span class="preco-antigo">${produto.precoAntigo}</span>` : ''}
                        <span class="preco-atual">${produto.precoAtual}</span>
                    </div>
                </div>
            </article>
        `;
        vitrine.insertAdjacentHTML('beforeend', cardHTML);
    });
    // Reativa as curtidas na tela
    if (typeof carregarCurtidas === 'function') carregarCurtidas();
    if (typeof atualizarContadorHeader === 'function') atualizarContadorHeader();
}
renderizarProdutos();

    // 2. Filtro de Busca Inteligente
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

    // 3. Sistema de Curtidas (LOCAL STORAGE)
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
            const elementoProduto = btnCurtir.closest('.produto-card') || btnCurtir.closest('.item-wishlist');
            if (!elementoProduto) return;
            
            const id = elementoProduto.getAttribute('data-id');
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
            window.carregarCurtidas(); // Sincroniza a remoção do curtir com a vitrine na hora
            
            // Se a gaveta estiver aberta, atualiza ela em tempo real
            const sidebarWishlist = document.getElementById('wishlist-sidebar');
            if (sidebarWishlist && sidebarWishlist.classList.contains('ativo') && typeof renderizarWishlist === 'function') {
                const itemNaGaveta = btnCurtir.closest('.item-wishlist');
                if (itemNaGaveta) {
                    itemNaGaveta.classList.add('removendo');
                    setTimeout(() => {
                        renderizarWishlist();
                    }, 300); // Aguarda exatos 300ms da animação CSS antes de re-renderizar
                } else {
                    renderizarWishlist();
                }
            }
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

    // 4. Sistema do Side Drawer (Gaveta de Wishlist)
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
            // Busca as informações do produto direto no "banco de dados" produtosAcervo
            if (typeof produtosAcervo === 'undefined') return;
            const produto = produtosAcervo.find(p => p.id === id);
            
            if (produto) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-wishlist';
                itemDiv.setAttribute('data-id', produto.id);
                itemDiv.innerHTML = `
                    <a href="produtos.html?id=${produto.id}">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <div class="item-wishlist-info">
                            <h4>${produto.nome}</h4>
                            <p>${produto.precoAtual}</p></div>
                    </a>
                    <button class="btn-curtir curtido">❤</button>`;
                listaContainer.appendChild(itemDiv);
            }
        });
    }

    // 5. Filtro por Categorias
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