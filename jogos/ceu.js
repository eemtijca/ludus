/*
 * Jogo: Manhã, tarde e noite.
 * O estudante relaciona cada período do dia ao seu nome.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Manhã, tarde e noite",
  bimestre: "3º bimestre",
  etiquetas: ["Geografia"],
  audio: "../assets/audio/ceu.mp3",
  instrucao:
    "Coloque cada cena no momento do dia. Toque a cena e depois o lugar.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/dia_noite.png" alt="" /></div>
    <div class="area-jogo">
      <div class="vagas" id="vagas"></div>
      <div class="pecas" id="cenas"></div>
    </div>
  </div>`;

const momentos = ["Manhã", "Tarde", "Noite"];
let selecionada = null;
const vagas = document.getElementById("vagas");

momentos.forEach((momento) => {
  const vaga = document.createElement("button");
  vaga.className = "vaga";
  vaga.type = "button";
  vaga.dataset.necessario = momento;
  vaga.textContent = momento;
  vaga.onclick = () => {
    if (!selecionada) return;
    if (selecionada !== momento) {
      AEE.errado(`Esta cena não pertence ao período ${momento}.`);
      return;
    }
    vaga.textContent = `${momento} ✓`;
    vaga.classList.add("cheio");
    document.querySelector(`[data-carta="${momento}"]`).classList.add("usado");
    selecionada = null;
    if (
      [...vagas.children].every((lugar) => lugar.classList.contains("cheio"))
    ) {
      AEE.concluir("Correto. O Sol marca os períodos do dia.");
    }
  };
  vagas.appendChild(vaga);
});

["Noite", "Manhã", "Tarde"].forEach((momento) => {
  const cena = document.createElement("button");
  cena.className = "peca";
  cena.type = "button";
  cena.dataset.carta = momento;
  cena.textContent = momento;
  cena.onclick = () => {
    document
      .querySelectorAll("#cenas .peca")
      .forEach((item) => item.classList.remove("selecionado"));
    cena.classList.add("selecionado");
    selecionada = momento;
  };
  document.getElementById("cenas").appendChild(cena);
});
