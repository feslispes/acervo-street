// 1. Catálogo de Roupas (Hardcoded)
const produtosAcervo = [
    {
        id: "moletom-essentials",
        nome: "Moletom Oversized Essentials (Bege)",
        categoria: "moletom",
        precoAntigo: "R$ 180,00",
        precoAtual: "R$ 119,90",
        imagem: "imgs_produtos/kit-moletom.png",
        link: "https://sua-url-de-afiliado.com/produto1"
    },
    {
        id: "calca-cargo-parachute",
        nome: "Calça Parachute Y2K (Preta)",
        categoria: "calcas",
        precoAntigo: "",
        precoAtual: "R$ 145,00",
        imagem: "imgs_produtos/kit-moletom.png",
        link: "https://sua-url-de-afiliado.com/produto2"
    },
    {
        id: "camiseta-heavy-weight",
        nome: "T-Shirt Heavy Cotton Boxy",
        categoria: "camisetas",
        precoAntigo: "R$ 90,00",
        precoAtual: "R$ 65,00",
        imagem: "imgs_produtos/kit-moletom.png",
        link: "https://sua-url-de-afiliado.com/produto3"
    },
    {
        id: "tenis-skate-chunky",
        nome: "Tênis Chunky Skater 90s",
        categoria: "tenis",
        precoAntigo: "R$ 250,00",
        precoAtual: "R$ 189,90",
        imagem: "imgs_produtos/kit-moletom.png",
        link: "https://sua-url-de-afiliado.com/produto4"
    }
];

// 2. Função que desenha os produtos na tela
function renderizarProdutos(categoriaFiltro = 'todos') {
    const vitrine = document.getElementById('vitrine-produtos');
    vitrine.innerHTML = ""; 

    const produtosFiltrados = categoriaFiltro === 'todos' 
        ? produtosAcervo 
        : produtosAcervo.filter(p => p.categoria === categoriaFiltro);

    produtosFiltrados.forEach(produto => {
        const cardHTML = `
            <article class="produto-card" data-id="${produto.id}" data-categoria="${produto.categoria}">
                <div class="img-bg">
                        <img src="${produto.imagem}" alt="${produto.nome}">
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

// Inicia a loja ao abrir o site
renderizarProdutos();