/*
 * Jogo: Lixo na lixeira.
 * O estudante destina cada resíduo ao lugar correto.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Lixo na lixeira",
  bimestre: "4º bimestre",
  etiquetas: ["Sociologia"],
  audio: "../assets/audio/lixo.mp3",
  instrucao: "Toque o lixo e depois a lixeira. Nada fica no chão.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/lixeira.png" alt="" /></div>
    <div class="area-jogo">
      <div class="caixas">
        <button class="caixa" id="lixeira" type="button">🗑️ Lixeira</button>
        <button class="caixa" id="chao" type="button">🛤️ Chão</button>
      </div>
      <div class="pecas" id="itens"></div>
    </div>
  </div>`;

const itens = ["🍾 Garrafa", "📄 Papel", "🍌 Casca", "🥤 Copo"];
let selecionado = null;
let quantidade = 0;
const areaItens = document.getElementById("itens");

itens.forEach((texto) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = texto;
  botao.onclick = () => {
    [...areaItens.children].forEach((outro) =>
      outro.classList.remove("selecionado"),
    );
    botao.classList.add("selecionado");
    selecionado = botao;
  };
  areaItens.appendChild(botao);
});

document.getElementById("lixeira").onclick = () => {
  if (!selecionado) return;
  selecionado.classList.add("usado");
  quantidade++;
  selecionado = null;
  if (quantidade === 4) {
    AEE.concluir("Correto. O pátio permanece limpo.");
  }
};

document.getElementById("chao").onclick = () => {
  AEE.errado("O chão não é lugar de lixo.");
};
