"use strict";

const botaoCurtir = document.querySelectorAll('.btn-curtir');

botaoCurtir.forEach((botao) => {
    botao.addEventListener('click', () => {
        botao.textContent = 'Curtido! ✅';
        botao.classList.toggle('curtido');
        botao.classList.contains('curtido') ? botao.textContent = 'Curtido! ✅' : botao.textContent = '❤️ Curtir';
    });  
    
});

const campoBusca = document.querySelector('#campo-busca');
const listaProdutos = document.querySelectorAll('.produto');

const limparTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

campoBusca.addEventListener('input', () => {
    const valorBusca = limparTexto(campoBusca.value);

    listaProdutos.forEach(produto => {
        const nomeBruto = produto.querySelector('h2').textContent;
        const nomeLimpo = limparTexto(nomeBruto); 
        
        (nomeLimpo.includes(valorBusca)) ? produto.style.display = "block" : produto.style.display = "none";
    });
});