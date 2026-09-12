/*
 * Jogo: O que é do sertão.
 * O estudante separa seres da Caatinga de seres de outros ambientes.
 */
const tabuleiro = AEE.montarTela({
  titulo: "O que é do sertão",
  bimestre: "3º bimestre",
  etiquetas: ["Biologia", "Geografia"],
  audio: "../assets/audio/caatinga.mp3",
  instrucao:
    "O que é do sertão vai para a Caatinga. O que não é, vai para Fora.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/plantas.png" alt="" /></div>
    <div class="area-jogo">
      <div class="caixas">
        <button class="caixa" id="dentro" type="button">🌵 Caatinga</button>
        <button class="caixa" id="fora" type="button">❄️ Fora</button>
      </div>
      <div class="pecas" id="seres"></div>
    </div>
  </div>`;

const seres = [
  { texto: "🌵 Cacto", doSertao: true },
  { texto: "🦔 Tatu", doSertao: true },
  { texto: "🌲 Pinheiro", doSertao: false },
  { texto: "🐧 Pinguim", doSertao: false },
].sort(() => Math.random() - 0.5);

let selecionado = null;
let acertos = 0;
const areaSeres = document.getElementById("seres");

seres.forEach((ser) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = ser.texto;
  botao.onclick = () => {
    [...areaSeres.children].forEach((outro) =>
      outro.classList.remove("selecionado"),
    );
    botao.classList.add("selecionado");
    selecionado = { ...ser, botao };
  };
  areaSeres.appendChild(botao);
});

function colocar(doSertao) {
  if (!selecionado) return;
  if (selecionado.doSertao !== doSertao) {
    AEE.errado("Este ser não pertence a esta caixa.");
    return;
  }
  selecionado.botao.classList.add("usado");
  acertos++;
  selecionado = null;
  if (acertos === 4) {
    AEE.concluir("Correto. Cacto e tatu são seres da Caatinga.");
  }
}

document.getElementById("dentro").onclick = () => colocar(true);
document.getElementById("fora").onclick = () => colocar(false);
