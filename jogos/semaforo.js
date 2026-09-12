/*
 * Jogo: Espere o verde.
 * O estudante aguarda o sinal verde antes de atravessar.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Espere o verde",
  bimestre: "1º bimestre",
  etiquetas: ["Sociologia", "Geografia"],
  audio: "../assets/audio/semaforo.mp3",
  instrucao: "Aguarde o sinal verde. Só então toque Atravessar.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/transito.png" alt="" /></div>
    <div class="area-jogo centro">
      <div class="sinal vermelho" id="luz"></div>
      <p id="rotulo">VERMELHO</p>
      <button class="botao marinho" id="atravessar" type="button">Atravessar</button>
    </div>
  </div>`;

let verde = false;

function alternarSinal() {
  verde = !verde;
  const luz = document.getElementById("luz");
  const rotulo = document.getElementById("rotulo");
  luz.className = `sinal ${verde ? "verde" : "vermelho"}`;
  rotulo.textContent = verde ? "VERDE" : "VERMELHO";
}

setInterval(alternarSinal, 4000);

document.getElementById("atravessar").onclick = () => {
  if (verde) {
    AEE.concluir("Correto. No sinal verde é permitido atravessar.");
  } else {
    AEE.errado("O sinal está vermelho. Aguarde o verde, sem pressa.");
  }
};
