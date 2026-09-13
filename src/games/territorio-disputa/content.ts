/**
 * Território em Disputa: conteúdo do jogo.
 *
 * 6 lotes com características de relevo e risco, 3 projetos da
 * comissão para alocar e a chuva de março como teste final.
 */

export interface Lot {
  id: number;
  name: string;
  terrain: string;
  /** Risco de alagamento na chuva forte. */
  floodRisk: boolean;
  icon: string;
}

export const LOTS: Lot[] = [
  {
    id: 0,
    name: "Baixada do rio",
    terrain: "Ponto mais baixo do bairro: a água de tudo que desce para aqui.",
    floodRisk: true,
    icon: "gota",
  },
  {
    id: 1,
    name: "Rua principal",
    terrain: "Eixo comercial pavimentado, com transporte passando na porta.",
    floodRisk: false,
    icon: "mapa",
  },
  {
    id: 2,
    name: "Vila dos moradores",
    terrain: "Casas antigas, rede de água ligada, escola a duas quadras.",
    floodRisk: false,
    icon: "usuarios",
  },
  {
    id: 3,
    name: "Parte alta",
    terrain: "Topo do morro, seco o ano inteiro, acesso por estrada de terra.",
    floodRisk: false,
    icon: "sol",
  },
  {
    id: 4,
    name: "Nascente",
    terrain: "Área de recarga do aquífero: alaga e abastece a vila inteira.",
    floodRisk: true,
    icon: "folha",
  },
  {
    id: 5,
    name: "Avenida do ônibus",
    terrain: "Corredor de transporte com drenagem nova, instalada em 2024.",
    floodRisk: false,
    icon: "mapa",
  },
];

export interface Project {
  id: string;
  icon: string;
  title: string;
  hook: string;
  brief: string;
  /** Lotes onde o projeto NÃO pode ficar (regra do jogo). */
  forbidden?: string;
  rule: string;
}

export const PROJECTS: Project[] = [
  {
    id: "praca",
    icon: "folha",
    title: "Praça drenante",
    hook: "Piso permeável + área verde",
    brief:
      "A associação de moradores pediu uma praça com piso que bebe a chuva. Vai bem na baixada: segura a água que desce do bairro e ainda vira point da vila.",
    rule: "Pode ir em qualquer lote: brilha nos lotes de risco.",
  },
  {
    id: "galpao",
    icon: "fabrica",
    title: "Galpão logístico",
    hook: "Estoque que não pode molhar",
    brief:
      "A empresa quer terreno para estocar mercadoria: precisa de chão seco e acesso fácil. Se a chuva de março pegar o estoque, o prejuízo molha a empresa inteira.",
    forbidden: "lotes que alagam",
    rule: "Proibido nos lotes que alagam (baixada e nascente).",
  },
  {
    id: "campo",
    icon: "usuarios",
    title: "Campo da vila",
    hook: "Lazer de fim de semana",
    brief:
      "O time da vila precisa de um campo com vestiário. Uso coletivo, fim de semana, e a comunidade já cuida do que é dela.",
    rule: "Combina melhor perto da vila, mas vale em qualquer lote.",
  },
];

export const RAIN_NARRATIVE = {
  title: "A chuva de março chega",
  text: "Em março, a chuva forte bate no bairro por três dias seguidos. A baixada vira lago, a nascente transborda, e cada escolha da comissão aparece debaixo d’água… ou não.",
};

export const VERDICT = {
  title: "Chuva vencida com planejamento",
  text: "A praça drenante segurou a água onde ela costuma parar, o galpão ficou longe do alagamento e o campo serviu a vila. Planejar território é isso: ler o relevo antes de assinar a planta.",
  detail: {
    label: "Ver o plano dos urbanistas",
    text: "Regra de ouro do planejamento: uso compatível com o relevo. Áreas de risco hidrológico pedem ocupação permeável (praças, parques): nunca estoque nem moradia. Infraestrutura nova (como a drenagem da avenida) muda o mapa do risco, mas a natureza sempre tem voto.",
  },
};
