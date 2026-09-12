/*
 * Jogo: Placa de silêncio.
 * O estudante escolhe a placa adequada e a aplica à sala.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Placa de silêncio",
  bimestre: "1º bimestre",
  etiquetas: ["Português", "Arte"],
  audio: "../assets/audio/silencio.mp3",
  instrucao: "A sala está agitada. Toque a placa de silêncio e depois a sala.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <button class="ilustracao" id="sala" type="button" aria-label="Sala de aula">
      <img src="../assets/imagens/sala_inclusiva.png" alt="" />
    </button>
    <div class="area-jogo">
      <p>Escolha a placa:</p>
      <div class="pecas" id="placas"></div>
    </div>
  </div>`;

const placas = [
  { texto: "🔇 Silêncio", correta: true },
  { texto: "🔊 Barulho", correta: false },
  { texto: "🏃 Correr", correta: false },
];

let selecionada = null;
const areaPlacas = document.getElementById("placas");

placas.forEach((placa) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = placa.texto;
  botao.onclick = () => {
    [...areaPlacas.children].forEach((item) =>
      item.classList.remove("selecionado"),
    );
    botao.classList.add("selecionado");
    selecionada = placa;
  };
  areaPlacas.appendChild(botao);
});

document.getElementById("sala").onclick = () => {
  if (!selecionada) {
    AEE.errado("Escolha uma placa antes de aplicá-la à sala.");
    return;
  }
  if (selecionada.correta) {
    AEE.concluir("Correto. A placa de silêncio pede quietude na sala.");
  } else {
    AEE.errado("Esta placa não pede silêncio. Observe as demais.");
  }
};
