/*
 * script.js
 * Funções compartilhadas pelos jogos da Sala de Recursos.
 * Expõe o objeto global AEE, usado pelos scripts de cada jogo.
 */
(function () {
  "use strict";

  let audioAtual = null;

  // Cria um elemento com classe e conteúdo opcionais.
  function criarElemento(etiqueta, classe, conteudo) {
    const elemento = document.createElement(etiqueta);
    if (classe) elemento.className = classe;
    if (conteudo != null) elemento.innerHTML = conteudo;
    return elemento;
  }

  window.AEE = {
    // Interrompe o áudio em reprodução e toca o arquivo informado.
    ouvir(origem) {
      if (audioAtual) {
        audioAtual.pause();
        audioAtual = null;
      }
      if (!origem) return;
      const audio = new Audio(origem);
      audioAtual = audio;
      audio.play().catch(() => {});
    },

    // Monta a estrutura comum da tela e devolve o tabuleiro para o jogo.
    montarTela(opcoes) {
      const raiz = document.getElementById("aplicativo");
      raiz.innerHTML = "";

      const topo = criarElemento("div", "topo");
      topo.innerHTML = `
        <div>
          <div class="sobrescrito">JOGO · D.U.A. · A.E.E.</div>
          <h1>${opcoes.titulo}</h1>
        </div>
        <div class="instituicao">
          ${opcoes.bimestre || ""}<br />
          <a href="../index.html" class="link-claro">Outros jogos</a>
        </div>`;
      raiz.appendChild(topo);

      const etiquetas = criarElemento("div", "etiquetas");
      (opcoes.etiquetas || []).forEach((texto) => {
        const etiqueta = criarElemento("span", "etiqueta");
        etiqueta.textContent = texto;
        etiquetas.appendChild(etiqueta);
      });
      raiz.appendChild(etiquetas);

      const instrucao = criarElemento("div", "instrucao");
      instrucao.id = "instrucao";
      instrucao.textContent = opcoes.instrucao;
      raiz.appendChild(instrucao);

      const tabuleiro = criarElemento("div", "tabuleiro");
      tabuleiro.id = "tabuleiro";
      raiz.appendChild(tabuleiro);

      const retorno = criarElemento("div", "retorno");
      retorno.id = "retorno";
      raiz.appendChild(retorno);

      const acoes = criarElemento("div", "acoes");

      const botaoOuvir = criarElemento("button", "botao fantasma");
      botaoOuvir.type = "button";
      botaoOuvir.textContent = "Ouvir";
      botaoOuvir.onclick = () => AEE.ouvir(opcoes.audio);
      acoes.appendChild(botaoOuvir);

      const botaoRepetir = criarElemento("button", "botao verde-agua");
      botaoRepetir.type = "button";
      botaoRepetir.textContent = "De novo";
      botaoRepetir.onclick = () => location.reload();
      acoes.appendChild(botaoRepetir);
      raiz.appendChild(acoes);

      const lembrete = criarElemento("div", "lembrete");
      lembrete.textContent =
        opcoes.lembrete || "Pode apontar. Pode pedir para repetir. Sem pressa.";
      raiz.appendChild(lembrete);

      const rodape = criarElemento("div", "rodape");
      rodape.innerHTML = `
        <span>EEMTI José Cláudio de Araújo · Sala de Recursos · 2026</span>
        <span>Toque ou clique. O botão Ouvir lê o recado.</span>`;
      raiz.appendChild(rodape);

      return tabuleiro;
    },

    // Exibe uma mensagem de acerto.
    certo(mensagem) {
      const retorno = document.getElementById("retorno");
      retorno.className = "retorno certo";
      retorno.textContent = mensagem || "Correto.";
    },

    // Exibe uma mensagem de erro.
    errado(mensagem) {
      const retorno = document.getElementById("retorno");
      retorno.className = "retorno errado";
      retorno.textContent = mensagem || "Ainda não. Tente de novo.";
    },

    // Exibe a mensagem de conclusão da atividade.
    concluir(mensagem) {
      AEE.certo(mensagem || "Atividade concluída.");
    },
  };
})();
