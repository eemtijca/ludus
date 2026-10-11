# Fontes

Arquivos usados pela interface por meio do `next/font/local`, configurado em
`src/app/layout.tsx`.

| Família | Arquivo         | Eixo   | Uso                      | Licença                    |
| ------- | --------------- | ------ | ------------------------ | -------------------------- |
| Baloo 2 | `baloo-2.woff2` | 400–800 | Títulos (`--font-baloo`) | OFL-1.1 em `OFL-Baloo2.txt` |
| Nunito  | `nunito.woff2`  | 200–1000 | Corpo (`--font-nunito`) | OFL-1.1 em `OFL-Nunito.txt` |

Ambas são fontes variáveis do Google Fonts no subset latino. O mesmo arquivo é
declarado uma vez por peso no `layout.tsx` para preservar o pareamento de pesos
gerado antes pelo `next/font/google`, inclusive para pesos intermediários, como
o 500 usado por `font-medium`.

## Origem

Baixadas em 2026-10-05 de `https://fonts.googleapis.com/css2?...` com o
User-Agent do Chrome 104, o mesmo que o Next.js envia, mantendo exatamente os
bytes que o `next/font/google` já auto-hospedava:

- Baloo 2: `https://fonts.gstatic.com/s/baloo2/v23/wXKrE3kTposypRyd51jcAM4olXc.woff2`
- Nunito: `https://fonts.gstatic.com/s/nunito/v32/XRXV3I6Li01BKofINeaBTMnFcQ.woff2`

## Por que local

O `next/font/google` consulta o Google Fonts no desenvolvimento e no build. O
Google responde de forma intermitente com URLs sem extensão
(`/l/font?kit=...`), que quebram a resolução do Turbopack com a mensagem
`next/font/google queries have exactly one entry` e derrubam o CI
([vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114)). Com os
arquivos locais não há rede envolvida e o resultado é determinístico.

## Como regerar

1. Busque `https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap`
   e `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap`
   com o User-Agent do Chrome 104.
2. Descarte respostas que contenham `/l/font` e repita a busca; a resposta
   esperada traz URLs `https://fonts.gstatic.com/s/...woff2`.
3. Salve a URL do bloco `/* latin */` de cada família como `baloo-2.woff2` e
   `nunito.woff2` e confira os bytes mágicos `wOF2`.
4. Rode `pnpm run lint`, `pnpm run tsc` e `pnpm run test:e2e:docker`.
