# LEVEL UP — Plano de implementação

## Escopo aprovado
MVP navegável de uma plataforma de evolução pessoal gamificada, priorizando dashboard, missões diárias, XP, streak, progresso físico/intelectual/alimentar, recompensas e navegação responsiva. Recursos de IA são apresentados como demonstração identificada, sem simular análises reais.

## Design

### Direções consideradas
- **Neon Performance OS** (0,07): painel escuro premium com verde-limão como sinal de progresso.
- **Calm Habit Studio** (0,08): mais editorial, claro e contemplativo.
- **RPG Utility Grid** (0,06): mais denso, modular e orientado a dados.

### Direção escolhida: Neon Performance OS
- **Movimento:** fitness tech premium + interfaces de instrumentos de performance.
- **Princípios:** foco imediato no próximo passo; contraste alto; progresso visível; densidade controlada.
- **Cores:** carvão quase preto, superfícies grafite, verde-limão proprietário para ações e evolução, branco suave para leitura.
- **Layout:** shell com sidebar fixa no desktop e canvas modular assimétrico; no mobile, navegação inferior e cards empilhados.
- **Assinaturas:** marca LEVEL UP com detalhe de barra ascendente; anel de nível; chips de categoria com acentos cromáticos.
- **Interação:** toda ação principal retorna feedback imediato, XP e mudança visual; tarefas concluídas ficam visivelmente resolvidas.
- **Animação:** transições de 180–260ms, barras com easing, entrada suave de cards e micro-pulse no streak; sem movimento decorativo excessivo.
- **Tipografia:** Inter para interface e Space Grotesk para títulos/wordmark; números grandes com peso 700.
- **Essência:** um sistema operacional pessoal para transformar consistência em evolução real. Personalidade: direto, energético, responsável.
- **Voz:** encorajadora sem exagero. Exemplos: “O próximo nível começa com o próximo check.” / “Consistência vence intensidade aleatória.”
- **Wordmark:** LEVEL UP em caixa alta, com U desenhado como degrau ascendente.
- **Cor proprietária:** lime pulse #C7F36B.

## Arquitetura
- `client/src/pages/Home.tsx`: shell principal, dashboard e estados de navegação local.
- `client/src/index.css`: tokens visuais, responsividade e componentes específicos do dashboard.
- `client/src/App.tsx`: tema escuro padrão e rota principal.
- `public/manus-routes.json`: manifesto de rotas para Preview.
- `server/` e `drizzle/`: permanecem preparados para persistência e autenticação; este MVP não inventa dados persistidos nem integra IA sem serviço configurado.

## Fluxo de implementação
1. Construir a experiência visual do dashboard com dados de demonstração claramente apresentados como estado inicial.
2. Implementar missões interativas locais: concluir missão, somar XP, atualizar barra, contador e feedback.
3. Implementar navegação entre visões do MVP: Visão geral, Missões, Treinos, Alimentação, Estudos e Evolução.
4. Adicionar responsividade para mobile com barra inferior.
5. Rodar diagnósticos TypeScript, build e iniciar Preview.
