# Manchester City · História 🩵

Site estático de fã sobre o **Manchester City**: a origem do clube (1880), a **Tríplice Coroa de 2023** e as estatísticas de **Erling Haaland** e **Kevin De Bruyne** — com animações, UI moderna e fotos reais do clube.

## Como abrir

Basta abrir `index.html` no navegador (duplo clique), ou, para servir localmente:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

> É preciso conexão com a internet: as fontes (Google Fonts) e as fotos (Wikimedia Commons) são carregadas online.

## Estrutura

```
├── index.html      # conteúdo (hero, origem, tríplice, jogadores, galeria)
├── css/style.css   # design system, animações e responsividade
└── js/main.js      # scroll-spy, contadores, barras, tilt 3D, lightbox
```

## Recursos

- Hero com foto do Etihad, brilhos animados e contadores de títulos
- Marquee "Champions of Europe 2023"
- Linha do tempo da origem (1880 → 2023) com preenchimento animado no scroll
- Cartões das três taças da Tríplice Coroa com tilt 3D e brilho no hover
- Estatísticas animadas (números + gráficos de barras) de Haaland e De Bruyne
- Galeria com lightbox, menu mobile e respeito a `prefers-reduced-motion`

## Fontes dos números

Manchester City FC, Premier League, UEFA, Opta e Transfermarkt (até o fim da temporada 2025/26).

## Créditos das fotos

Todas as fotos são do Wikimedia Commons, com atribuição listada no rodapé do site (CC BY / CC BY-SA / domínio público).
