/*
 * Jogo: Dividir é justo.
 * O estudante reparte as frutas em partes iguais.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Dividir é justo",
  bimestre: "4º bimestre",
  etiquetas: ["Filosofia", "Matemática"],
  audio: "../assets/audio/dividir.mp3",
  instrucao:
    "São seis frutas e dois pratos. Cada prato deve receber a mesma quantidade.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/justica.png" alt="" /></div>
    <div class="area-jogo">
      <div class="caixas">
        <button class="caixa" id="pratoA" type="button">Prato A (0)</button>
        <button class="caixa" id="pratoB" type="button">Prato B (0)</button>
      </div>
      <div class="pecas" id="frutas"></div>
    </div>
  </div>`;

let selecionada = null;
let pratoA = 0;
let pratoB = 0;
let restantes = 6;
const areaFrutas = document.getElementById("frutas");

for (let i = 0; i < 6; i++) {
  const fruta = document.createElement("button");
  fruta.className = "peca";
  fruta.type = "button";
  fruta.textContent = "🍊";
  fruta.onclick = () => {
    [...areaFrutas.children].forEach((outra) =>
      outra.classList.remove("selecionado"),
    );
    fruta.classList.add("selecionado");
    selecionada = fruta;
  };
  areaFrutas.appendChild(fruta);
}

function servir(destino) {
  if (!selecionada) return;
  selecionada.classList.add("usado");
  selecionada = null;
  restantes--;
  if (destino === "A") {
    pratoA++;
  } else {
    pratoB++;
  }
  document.getElementById("pratoA").textContent = `Prato A (${pratoA})`;
  document.getElementById("pratoB").textContent = `Prato B (${pratoB})`;
  if (restantes === 0) {
    if (pratoA === 3 && pratoB === 3) {
      AEE.concluir("Correto. Três frutas para cada prato.");
    } else {
      AEE.errado("As quantidades ficaram diferentes. Toque De novo.");
    }
  }
}

document.getElementById("pratoA").onclick = () => servir("A");
document.getElementById("pratoB").onclick = () => servir("B");
