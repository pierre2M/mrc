# Guide de démarrage — Sprint 1

## Ce que Claude a déjà créé

Le scaffold complet du projet est dans ce dossier `mrc-site/`. Il contient :
- L'application SvelteKit avec Tailwind CSS
- Les 6 pages éditoriales (Accueil, Présentation, Usage 1 placeholder, Grammaires, Documentation, Gouvernance)
- Le composant `MrcStatusBadge` (bandeau de statut sur toutes les sorties IA)
- La navigation, le footer, la charte graphique sobre
- Le fichier `.github/workflows/ci.yml` (CI GitHub Actions)
- Le `.gitignore` et le `.env.example`
- Ce README

---

## Étape 1 — Installer les dépendances (sur ta machine)

```bash
# Depuis le dossier mrc-site/
npm install -g pnpm   # si pnpm n'est pas installé

pnpm install

# Tester en local
cd apps/web
pnpm dev
# → http://localhost:5173
```

---

## Étape 2 — Créer le repo GitHub

1. Aller sur https://github.com/new
2. Nom du repo : `mrc-site` (ou `registre-communalite`)
3. Visibilité : **Public** (recommandé, cohérent avec l'accès ouvert du MRC)
4. Ne pas initialiser avec README (on a déjà tout)
5. Cliquer "Create repository"

Puis, depuis le terminal dans `mrc-site/` :

```bash
git init
git add .
git commit -m "feat: scaffold Sprint 1 — squelette SvelteKit + Tailwind + pages éditoriales"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/mrc-site.git
git push -u origin main
```

Remplacer `TON_USERNAME` par ton identifiant GitHub.

---

## Étape 3 — Déployer sur Vercel (gratuit)

1. Aller sur https://vercel.com → se connecter avec GitHub
2. Cliquer "New Project" → importer le repo `mrc-site`
3. **Configuration importante** :
   - Framework Preset : `SvelteKit`
   - Root Directory : `apps/web` ← **essentiel pour le monorepo**
   - Build Command : `pnpm run build`
   - Install Command : `pnpm install`
4. Cliquer "Deploy"

Vercel va automatiquement créer une URL preview du type :
`mrc-site-ton-username.vercel.app`

À partir de là, chaque `git push` sur `main` redéploie automatiquement.

---

## Étape 4 — Réserver le domaine registre-communalite.org

**Option recommandée : Gandi**
1. Aller sur https://www.gandi.net
2. Rechercher `registre-communalite.org`
3. Si disponible : environ 15–20 €/an pour le .org

**Alternative : OVH** (https://www.ovhcloud.com/fr/domains/)

Une fois le domaine réservé, dans Vercel :
- Settings → Domains → Add domain : `registre-communalite.org`
- Suivre les instructions DNS (généralement : ajouter un enregistrement A et CNAME chez Gandi/OVH)
- HTTPS Let's Encrypt activé automatiquement

---

## Étape 5 — Vérifier que tout tourne

Checklist Sprint 1 :

- [ ] `pnpm dev` fonctionne en local
- [ ] Les 6 pages sont accessibles (/, /presentation, /usage-1, /grammaires, /documentation, /gouvernance)
- [ ] Repo GitHub créé et code poussé
- [ ] CI GitHub Actions passe (onglet Actions sur GitHub)
- [ ] Déploiement Vercel actif — URL preview partageable
- [ ] Domaine registre-communalite.org réservé (Gandi ou OVH)

---

## Sprint 2 — Ce qui vient ensuite

Une fois le Sprint 1 validé, le Sprint 2 construira le démonstrateur Usage 1 :
- Backend serverless (Vercel Functions) avec appel API Anthropic
- Ajouter `ANTHROPIC_API_KEY` dans Vercel → Settings → Environment Variables
- Interface à 3 colonnes (préparation / chat / journal MRC)
- 3 modes de réponse (vulgarisation, architecture, cadres théoriques)

---

*Scaffold généré avec Claude · MRC v5.4 · Mai 2026*
