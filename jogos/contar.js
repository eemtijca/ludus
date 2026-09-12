/*
 * Jogo: Toque para contar.
 * O estudante conta as bananas e informa a quantidade.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Toque para contar",
  bimestre: "1º bimestre",
  etiquetas: ["Matemática"],
  audio: "../assets/audio/contar.mp3",
  instrucao: "Toque cada banana. Depois escolha o número que você contou.",
});

const total = 6;

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/seis.png" alt="" /></div>
    <div class="area-jogo">
      <div class="contador" id="contador">0</div>
      <div class="pecas" id="bananas"></div>
      <p>Quantas bananas você contou?</p>
      <div class="pecas" id="numeros"></div>
    </div>
  </div>`;

let contagem = 0;
const areaBananas = document.getElementById("bananas");

for (let i = 0; i < total; i++) {
  const banana = document.createElement("button");
  banana.className = "peca";
  banana.type = "button";
  banana.textContent = "🍌";
  banana.onclick = () => {
    if (banana.classList.contains("usado")) return;
    banana.classList.add("usado");
    contagem++;
    banana.textContent = String(contagem);
    document.getElementById("contador").textContent = contagem;
  };
  areaBananas.appendChild(banana);
}

[4, 6, 9].forEach((numero) => {
  const botao = document.createElement("button");
  botao.className = "peca";
  botao.type = "button";
  botao.textContent = String(numero);
  botao.onclick = () => {
    if (contagem !== total) {
      AEE.errado("Toque todas as bananas antes de responder.");
      return;
    }
    if (numero === total) {
      AEE.concluir("Correto. São seis bananas.");
    } else {
      AEE.errado("Conte novamente os números marcados nas bananas.");
    }
  };
  document.getElementById("numeros").appendChild(botao);
});
