# icaroglauco.online

Site pessoal e portfólio de Ícaro Glauco, construído com Vite, JavaScript/TypeScript, Three.js e Firebase Hosting.

## Desenvolvimento local

Requer Node.js e npm.

```bash
npm install
npm run dev
```

Para gerar e visualizar a build:

```bash
npm run build
npm run preview
```

O projeto executa `scripts/generate-macro-frontend.mjs` antes de `dev` e `build`. O comando `npm run deploy` publica no Firebase e requer autenticação e configuração do projeto Firebase.

## Estrutura

- `src/` e `public/`: aplicação e assets.
- `functions/`: funções Firebase.
- `scripts/`: geração do frontend e automação do blog.
- `firebase.json`: configuração do Firebase Hosting.
