/*
 * Jogo: Ciclo da água.
 * O estudante ordena as quatro etapas do ciclo.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Ciclo da água",
  bimestre: "1º bimestre",
  etiquetas: ["Física", "Geografia"],
  audio: "../assets/audio/ciclo.mp3",
  instrucao:
    "Monte o ciclo: Sol, vapor, nuvem e chuva. Toque a carta e depois o lugar.",
});

const ordem = ["Sol", "Vapor", "Nuvem", "Chuva"];

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/ciclo.png" alt="" /></div>
    <div class="area-jogo">
      <div class="vagas" id="vagas"></div>
      <p>Cartas:</p>
      <div class="pecas" id="cartas"></div>
    </div>
  </div>`;

let selecionada = null;
const vagas = document.getElementById("vagas");

ordem.forEach((etapa, indice) => {
  const vaga = document.createElement("button");
  vaga.className = "vaga";
  vaga.type = "button";
  vaga.dataset.necessario = etapa;
  vaga.textContent = `${indice + 1}. ?`;
  vaga.onclick = () => {
    if (!selecionada) return;
    if (selecionada !== vaga.dataset.necessario) {
      AEE.errado(`Esta não é a etapa ${indice + 1}.`);
      return;
    }
    vaga.textContent = `${indice + 1}. ${selecionada}`;
    vaga.classList.add("cheio");
    document
      .querySelector(`[data-carta="${selecionada}"]`)
      .classList.add("usado");
    selecionada = null;
    if (
      [...vagas.children].every((lugar) => lugar.classList.contains("cheio"))
    ) {
      AEE.concluir("Correto. O ciclo da água retorna ao início.");
    }
  };
  vagas.appendChild(vaga);
});

const cartasEmbaralhadas = [...ordem].sort(() => Math.random() - 0.5);
const areaCartas = document.getElementById("cartas");

cartasEmbaralhadas.forEach((etapa) => {
  const carta = document.createElement("button");
  carta.className = "peca";
  carta.type = "button";
  carta.dataset.carta = etapa;
  carta.textContent = etapa;
  carta.onclick = () => {
    [...areaCartas.children].forEach((item) =>
      item.classList.remove("selecionado"),
    );
    carta.classList.add("selecionado");
    selecionada = etapa;
  };
  areaCartas.appendChild(carta);
});
