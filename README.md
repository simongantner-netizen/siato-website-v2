# Siato Marketing-Website

Arbeitsstand der Siato-Seite (allDates AG). Ab dem 09.09.2026 läuft die Arbeit in
diesem Repo weiter.

| | Repo | Live |
|---|---|---|
| **Arbeitsstand** (hier, `origin`) | `simongantner-netizen/siato-website-v2` | https://simongantner-netizen.github.io/siato-website-v2/ |
| **Eingefroren** (Remote `frozen`) | `simongantner-netizen/siato-website` | https://simongantner-netizen.github.io/siato-website/ |

Das eingefrorene Repo hält den Stand vom 22.08.2026. Auf seine Live-URL verlinkt
die Kurzpräsentation für Naturspur, deren Offerte am 08.09.2026 rausging - dort
darf sich nichts mehr bewegen, bis Simon es ausdrücklich freigibt. Der Push-Pfad
des Remotes `frozen` ist deshalb absichtlich unbrauchbar gemacht.

Entwickeln: `npm run dev`. Veröffentlichen: `./deploy.sh` (baut und schiebt nach
`origin gh-pages`, bricht ab, wenn origin nicht auf v2 zeigt).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
