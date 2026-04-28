

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

    // 4. Renderiza os Produtos Relacionados com botão "Carregar Mais"
    const todosProdutosRelacionados = produtosAcervo
        .filter(p => p.categoria === produtoEncontrado.categoria && p.id !== produtoEncontrado.id)
        .sort(() => Math.random() - 0.5); // Embaralha

    const produtosIniciais = todosProdutosRelacionados.slice(0, 4);

    const criarCardRelacionado = (produto) => `
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

    produtosIniciais.forEach(produto => {
        containerRelacionados.insertAdjacentHTML('beforeend', criarCardRelacionado(produto));
    });
    
    if (todosProdutosRelacionados.length > 4) {
        const containerBotao = document.createElement('div');
        containerBotao.id = 'container-btn-relacionados';
        containerBotao.innerHTML = `<button id="btn-carregar-relacionados" class="btn-filtro">Carregar Mais</button>`;
        
        containerRelacionados.insertAdjacentElement('afterend', containerBotao);

        document.getElementById('btn-carregar-relacionados').addEventListener('click', () => {
            const produtosRestantes = todosProdutosRelacionados.slice(4);
            
            produtosRestantes.forEach(produto => {
                containerRelacionados.insertAdjacentHTML('beforeend', criarCardRelacionado(produto));
            });

            containerBotao.remove();
            if (typeof window.carregarCurtidas === 'function') window.carregarCurtidas();
        });
    }
    
    if (typeof window.carregarCurtidas === 'function') window.carregarCurtidas();

    // 5. Adiciona o efeito de Zoom na imagem de destaque
    const imgContainer = document.querySelector('.imagem-destaque');
    const imgPrincipal = document.getElementById('img-principal');

    if (imgContainer && imgPrincipal) {
        // Função isolada para calcular e aplicar o zoom
        const aplicarZoom = (x, y) => {
            const rect = imgContainer.getBoundingClientRect();
            const posX = x - rect.left;
            const posY = y - rect.top;
            const xPercent = (posX / rect.width) * 100;
            const yPercent = (posY / rect.height) * 100;
            imgPrincipal.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            imgPrincipal.style.transform = 'scale(2)'; // Aumenta a imagem em 2x
        };

        const removerZoom = () => {
            imgPrincipal.style.transformOrigin = 'center center';
            imgPrincipal.style.transform = 'scale(1)'; // Retorna a imagem ao tamanho original
        };

        let zoomAtivo = false;
        let ehTouch = false;

        // Eventos para Mouse (Desktop)
        imgContainer.addEventListener('click', e => {
            if (ehTouch) return; // Impede conflito com o evento de toque no Mobile
            zoomAtivo = !zoomAtivo; // Alterna entre ligado e desligado
            
            if (zoomAtivo) {
                aplicarZoom(e.clientX, e.clientY);
                imgContainer.style.cursor = 'zoom-out'; // Muda a "lupa" para indicar que vai diminuir
            } else {
                removerZoom();
                imgContainer.style.cursor = 'zoom-in'; // Retorna para a indicação de aumentar
            }
        });

        imgContainer.addEventListener('mousemove', e => {
            if (zoomAtivo && !ehTouch) aplicarZoom(e.clientX, e.clientY);
        });

        imgContainer.addEventListener('mouseleave', () => {
            if (ehTouch) return;
            zoomAtivo = false;
            removerZoom();
            imgContainer.style.cursor = 'zoom-in';
        });

        // Eventos para Toque (Mobile)
        imgContainer.addEventListener('touchstart', e => {
            ehTouch = true;
            aplicarZoom(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        imgContainer.addEventListener('touchmove', e => {
            e.preventDefault(); // Impede a rolagem da página enquanto o usuário arrasta o dedo na imagem
            aplicarZoom(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        imgContainer.addEventListener('touchend', removerZoom);
    }

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