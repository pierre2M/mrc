# mrc-site

Site web de présentation et d'expérimentation du **Modèle de Registres de Communalité (MRC) v5.5**.

> Prototype scientifique en accès ouvert — ce site ne valide rien. Toutes les sorties IA sont des brouillons interprétatifs, non opposables.

## Stack technique

- **Framework** : SvelteKit 2 + `@sveltejs/adapter-vercel`
- **Style** : Tailwind CSS 3
- **Contenu éditorial** : mdsvex (Markdown + composants Svelte)
- **LLM** : Claude Sonnet 4.6 via Anthropic API (Sprint 2)
- **Hébergement** : Vercel (prototype) → Clever Cloud (production publique)
- **Domaine** : registre-communalite.org

## Structure du projet

```
mrc-site/
  apps/
    web/                  # Application SvelteKit principale
      src/routes/         # Pages (Accueil, Présentation, Usages 1-3, Grammaires, Ressources)
      src/lib/            # Composants, logique agent, schéma MRC
      static/             # Assets statiques
  packages/
    mrc-core/             # Schéma MRC partagé (typage)
  content/
    pages/*.md            # Contenu éditorial éditable
    grammars/*.md         # Fiches grammaires
    cases/                # Cas d'enquête fictifs (Usage 2)
  .github/workflows/      # CI GitHub Actions
```

## Démarrage rapide

```bash
# Prérequis : Node.js ≥ 18, pnpm ≥ 8
npm install -g pnpm

# Installation
pnpm install

# Développement local
pnpm dev

# Build
pnpm build
```

## Sprints

| Sprint | Contenu | Statut |
|--------|---------|--------|
| S1 — Squelette éditorial | Pages statiques + déploiement Vercel preview | ✅ Fait |
| S2 — Démonstrateur Usage 1 | Backend serverless + 3 modes de réponse | ✅ Fait |
| S3 — Actualisation v5.5 + interface pédagogique | Bascule v5.4→v5.5, grammaires G1–G12, route `/pedagogie` (« Comprendre, pas à pas ») intégrée à la charte du site | 🟡 En cours |
| S4 — Vitrines Usages 2 & 3 + mise en ligne | Démonstrations interactives, explorateur, bascule domaine public | ⬜ À venir |

## Variables d'environnement

Copier `apps/web/.env.example` en `apps/web/.env` et renseigner :

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Licence

MIT · MRC v5.5 · Juin 2026
# mrc
