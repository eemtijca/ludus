/*
 * Jogo: Chamar para a roda.
 * O estudante percebe a exclusão e abre espaço na roda.
 */
const tabuleiro = AEE.montarTela({
  titulo: "Chamar para a roda",
  bimestre: "1º bimestre",
  etiquetas: ["Sociologia"],
  audio: "../assets/audio/incluir.mp3",
  instrucao:
    "Um estudante ficou fora da roda. Toque a cadeira vazia para chamá-lo.",
});

tabuleiro.innerHTML = `
  <div class="linha">
    <div class="ilustracao"><img src="../assets/imagens/incluir.png" alt="" /></div>
    <div class="area-jogo">
      <div class="roda">
        <button class="assento" type="button">🙂</button>
        <button class="assento" type="button">🙂</button>
        <button class="assento vazio" id="vaga" type="button">vazia</button>
        <button class="assento" type="button">🙂</button>
      </div>
      <p>Fora da roda:</p>
      <button class="assento fora" id="fora" type="button">🙂 sozinho</button>
    </div>
  </div>`;

document.getElementById("vaga").onclick = () => {
  const vaga = document.getElementById("vaga");
  vaga.textContent = "🙂";
  vaga.classList.remove("vazio");
  document.getElementById("fora").classList.add("oculto");
  AEE.concluir("Correto. Chamar para a roda é incluir.");
};

document.getElementById("fora").onclick = () => {
  AEE.errado("Toque a cadeira vazia, não o estudante.");
};
