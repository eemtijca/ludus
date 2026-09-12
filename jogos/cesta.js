/*
 * Jogo: Cesta da feira.
 * O estudante separa alimentos de objetos que não são comida.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Cesta da feira",
  bimestre: "2º bimestre",
  etiquetas: ["Biologia"],
  audio: "../assets/audio/cesta.mp3",
  instrucao: "Coloque apenas comida na cesta. Toque o item e depois a cesta.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/frutas.png" alt="" /></div>
    <div class="area-jogo">
      <button class="caixa" id="cesta" type="button">🧺 Cesta (0)</button>
      <div class="pecas" id="itens"></div>
    </div>
  </div>`;

const itens = [
  { texto: "🍌 Banana", comida: true },
  { texto: "🍊 Laranja", comida: true },
  { texto: "🍎 Maçã", comida: true },
  { texto: "🔨 Prego", comida: false },
  { texto: "📘 Livro", comida: false },
  { texto: "🍇 Uva", comida: true },
].sort(() => Math.random() - 0.5);

let selecionado = null;
let quantidade = 0;
const areaItens = document.getElementById("itens");

itens.forEach((item) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = item.texto;
  botao.onclick = () => {
    [...areaItens.children].forEach((outro) =>
      outro.classList.remove("selecionado"),
    );
    botao.classList.add("selecionado");
    selecionado = { ...item, botao };
  };
  areaItens.appendChild(botao);
});

document.getElementById("cesta").onclick = () => {
  if (!selecionado) return;
  if (!selecionado.comida) {
    AEE.errado("Este item não é comida da feira.");
    return;
  }
  selecionado.botao.classList.add("usado");
  quantidade++;
  document.getElementById("cesta").textContent = `🧺 Cesta (${quantidade})`;
  selecionado = null;
  if (quantidade === 4) {
    AEE.concluir("Correto. A cesta contém apenas alimentos.");
  }
};
