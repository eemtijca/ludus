/*
 * Jogo: Pagar na feira.
 * O estudante soma as moedas até o preço pedido.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Pagar na feira",
  bimestre: "2º bimestre",
  etiquetas: ["Matemática"],
  audio: "../assets/audio/pagar.mp3",
  instrucao:
    "A banana custa 4 reais. Toque as moedas até somar 4 e depois toque Pagar.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/moedas.png" alt="" /></div>
    <div class="area-jogo">
      <p>Preço: <strong>4 reais</strong></p>
      <div class="contador" id="soma">0</div>
      <div class="pecas" id="moedas"></div>
      <button class="botao marinho" id="pagar" type="button">Pagar</button>
    </div>
  </div>`;

let soma = 0;

[1, 1, 1, 2, 2].forEach((valor) => {
  const moeda = document.createElement("button");
  moeda.className = "peca";
  moeda.type = "button";
  moeda.textContent = valor + " real" + (valor > 1 ? "is" : "");
  moeda.onclick = () => {
    if (moeda.classList.contains("usado")) return;
    moeda.classList.add("usado");
    soma += valor;
    document.getElementById("soma").textContent = soma;
  };
  document.getElementById("moedas").appendChild(moeda);
});

document.getElementById("pagar").onclick = () => {
  if (soma === 4) {
    AEE.concluir("Correto. Quatro reais é o preço exato.");
  } else if (soma < 4) {
    AEE.errado("Falta dinheiro. Toque mais uma moeda.");
  } else {
    AEE.errado("Passou de 4 reais. Toque De novo e some outra vez.");
  }
};
