/*
 * Jogo: Fila com respeito.
 * O estudante organiza a fila e deixa de fora quem empurra.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Fila com respeito",
  bimestre: "1º bimestre",
  etiquetas: ["Sociologia", "Educação Física"],
  audio: "../assets/audio/fila.mp3",
  instrucao: "Organize a fila em três lugares. Deixe de fora quem empurra.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/fila.png" alt="" /></div>
    <div class="area-jogo">
      <p>Fila (3 lugares):</p>
      <div class="vagas" id="fila"></div>
      <p>Estudantes:</p>
      <div class="pecas" id="estudantes"></div>
    </div>
  </div>`;

const estudantes = [
  { texto: "🙂 Bia", podeEntrar: true },
  { texto: "🙂 Caio", podeEntrar: true },
  { texto: "🙂 Ana", podeEntrar: true },
  { texto: "😠 Empurra", podeEntrar: false },
].sort(() => Math.random() - 0.5);

let selecionado = null;
const fila = document.getElementById("fila");

for (let i = 0; i < 3; i++) {
  const vaga = document.createElement("button");
  vaga.className = "vaga";
  vaga.type = "button";
  vaga.textContent = `lugar ${i + 1}`;
  vaga.onclick = () => {
    if (!selecionado || vaga.classList.contains("cheio")) return;
    if (!selecionado.podeEntrar) {
      AEE.errado("Quem empurra não entra na fila.");
      return;
    }
    vaga.textContent = selecionado.texto;
    vaga.classList.add("cheio");
    selecionado.botao.classList.add("usado");
    selecionado = null;
    if (
      [...fila.children].every((lugar) => lugar.classList.contains("cheio"))
    ) {
      AEE.concluir("Correto. A fila foi organizada sem empurrão.");
    }
  };
  fila.appendChild(vaga);
}

const areaEstudantes = document.getElementById("estudantes");
estudantes.forEach((estudante) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = estudante.texto;
  botao.onclick = () => {
    [...areaEstudantes.children].forEach((item) =>
      item.classList.remove("selecionado"),
    );
    botao.classList.add("selecionado");
    selecionado = {
      texto: estudante.texto,
      podeEntrar: estudante.podeEntrar,
      botao,
    };
  };
  areaEstudantes.appendChild(botao);
});
