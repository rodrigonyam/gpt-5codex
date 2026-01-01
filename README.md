# Employee Management Portal

A bold Vite + React + TypeScript experience for tracking teams, headcount, and hiring momentum. The UI pairs a gradient-heavy atmospheric background with glassmorphic panels, fast routing, and contextual state powered by React Context + Reducer.

## Stack

- Vite 6 + React 18 + TypeScript
- Tailwind CSS with custom palettes and typography (Space Grotesk + General Sans)
- React Router for page transitions
- TanStack Table for the directory grid
- Context-based state with derived metrics

## Available scripts

```bash
pnpm install   # (or npm/yarn) install dependencies
pnpm dev       # start dev server on http://localhost:5173
pnpm build     # type-check + production build
pnpm preview   # serve the build locally
pnpm lint      # run ESLint with strict settings
```

## Features

- Dashboard with live metrics, add-employee form, and curated activity feed
- Directory view with searchable, filterable employee table
- Departments & Roles workspace with templates, permission levels, and assignment board
- Status-aware badges, responsive layout, and mobile drawer navigation
- Strong design language (purposeful typography, gradients, ambient lighting) per brief

## Next ideas

1. Persist context changes via an API or local storage.
2. Extend filters with salary bands and remote/on-site toggles.
3. Add detailed profile drawers and performance snapshots.
