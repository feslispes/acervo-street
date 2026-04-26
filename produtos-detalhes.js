

// 1. Captura o ID da URL
const urlParams = new URLSearchParams(window.location.search);
const idUrl = urlParams.get('id');

// 2. Busca o produto no banco (seu arquivo produtos.js)
const produtoEncontrado = produtosAcervo.find(p => p.id === idUrl);

const container = document.getElementById('conteudo-produto');
const containerRelacionados = document.getElementById('grid-relacionados');

if (produtoEncontrado) {
    // Verifica se o array 'imagens' existe e tem fotos. Se não, usa a imagem principal como padrão.
    const imagensGaleria = produtoEncontrado.imagens && produtoEncontrado.imagens.length > 0 ? produtoEncontrado.imagens : [produtoEncontrado.imagem];

    // 3. Renderiza a parte de cima (Detalhes)
    container.innerHTML = `
        <div class="produto-view">
            <div class="galeria">
                ${imagensGaleria.length > 1 ? `
                <div class="thumbnails">
                    ${imagensGaleria.map((imgUrl, index) => `<img src="${imgUrl}" class="thumb ${index === 0 ? 'ativo' : ''}" onclick="mudarImagem(this)">`).join('')}
                </div>
                ` : ''}
                <div class="imagem-destaque">
                    <img src="${imagensGaleria[0]}" id="img-principal" alt="${produtoEncontrado.nome}">
                </div>
            </div>
            
            <div class="info-view">
                <h1>${produtoEncontrado.nome}</h1>
                <div class="precos">
                    ${produtoEncontrado.precoAntigo ? `<span class="preco-antigo" style="font-size: 18px; text-decoration: line-through; color: #888;">${produtoEncontrado.precoAntigo}</span>` : ''}
                    <span class="preco-destaque" style="font-family: monospace;">${produtoEncontrado.precoAtual}</span>
                </div>
                
                ${produtoEncontrado.tamanhos && produtoEncontrado.tamanhos.length > 0 ? `
                <div class="secao-tamanhos">
                    <p>Tamanhos</p>
                    <div class="botoes-tamanho">
                        ${produtoEncontrado.tamanhos.map(tamanho => `<button class="btn-tamanho">${tamanho}</button>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="favoritar-view produto-card" data-id="${produtoEncontrado.id}">
                    <span>Salvar nos favoritos:</span>
                    <button class="btn-curtir">♡</button>
                </div>

                <a href="${produtoEncontrado.link}" target="_blank" class="btn-comprar-view">
                    🛒 Comprar na Loja Parceira
                </a>

                <div class="descricao-view">
                    <p style="font-family: monospace;"><strong>DESCRIÇÃO</strong></p>
                    <p style="font-size: 14px; color: #555;">
                        ${produtoEncontrado.descricao}
                    </p>
                </div>
            </div>
        </div>
    `;

    // 4. Renderiza os Produtos Relacionados (Filtra a mesma categoria, exclui o atual, pega 3 ou 4 itens)
    const produtosRelacionados = produtosAcervo
        .filter(p => p.categoria === produtoEncontrado.categoria && p.id !== produtoEncontrado.id)
        .slice(0, 4);

    produtosRelacionados.forEach(produto => {
        const cardHTML = `
            <article class="produto-card" data-id="${produto.id}">
                <div class="img-bg" style="position: relative;">
                    <a href="produtos.html?id=${produto.id}">
                        <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100%;">
                    </a>
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
        containerRelacionados.insertAdjacentHTML('beforeend', cardHTML);
    });
    
    if (typeof window.carregarCurtidas === 'function') window.carregarCurtidas();

} else {
    container.innerHTML = `<h2 style="text-align: center; margin-top: 50px;">Produto não encontrado.</h2>`;
}

// Funções interativas para a página
function mudarImagem(elementoThumb) {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('ativo'));
    elementoThumb.classList.add('ativo');
    document.getElementById('img-principal').src = elementoThumb.src;
}

function selecionarTamanho(botao) {
    document.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
}