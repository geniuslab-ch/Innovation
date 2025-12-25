# 📝 Guide : Publication Automatique d'Articles de Blog

## 🎯 Objectif
Publier automatiquement un article par semaine sur votre blog GeniusLab sans intervention manuelle.

---

## 🛠️ Solutions Recommandées

### Option 1 : GitHub Actions + Scheduled Commits ⭐⭐⭐

**Avantages** :
- ✅ Gratuit
- ✅ Totalement automatisé
- ✅ Intégré à votre workflow Git
- ✅ Pas de serveur supplémentaire

**Comment ça marche** :
1. Vous préparez tous vos articles à l'avance
2. GitHub Actions publie automatiquement 1 article par semaine
3. Le site se redéploie automatiquement sur Railway

**Mise en place** :

Créez le fichier `.github/workflows/publish-blog.yml` :

```yaml
name: Publish Weekly Blog Post

on:
  schedule:
    # Tous les lundis à 9h (UTC)
    - cron: '0 9 * * 1'
  workflow_dispatch: # Permet déclenchement manuel

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Publish next article
        run: |
          # Script pour déplacer un article de /drafts vers /blog
          if [ -d "blog-drafts" ] && [ "$(ls -A blog-drafts)" ]; then
            NEXT_ARTICLE=$(ls blog-drafts | head -1)
            mv "blog-drafts/$NEXT_ARTICLE" .
            echo "Published: $NEXT_ARTICLE"
          fi
      
      - name: Update blog index
        run: |
          # Script pour mettre à jour blog.html avec le nouvel article
          # (Vous pouvez utiliser un script Python ou Node.js)
          
      - name: Commit and push
        run: |
          git config user.name "Blog Bot"
          git config user.email "bot@geniuslab.ch"
          git add .
          git commit -m "Auto-publish: Weekly blog post"
          git push
```

**Structure de dossiers** :
```
/blog-drafts/
  ├── article-semaine-1.html
  ├── article-semaine-2.html
  ├── article-semaine-3.html
  └── ...
```

---

### Option 2 : Netlify CMS (Headless CMS) ⭐⭐⭐

**Avantages** :
- ✅ Interface d'administration visuelle
- ✅ Planification de publication intégrée
- ✅ Prévisualisation avant publication
- ✅ Gratuit jusqu'à 100 utilisateurs

**Comment ça marche** :
1. Vous installez Netlify CMS sur votre site
2. Vous créez vos articles dans l'interface admin
3. Vous planifiez la date de publication
4. Netlify publie automatiquement à la date choisie

**Installation** :

1. Ajoutez `admin/index.html` :
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin - GeniusLab Blog</title>
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js"></script>
</head>
<body></body>
</html>
```

2. Ajoutez `admin/config.yml` :
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "images/blog"
public_folder: "/images/blog"

collections:
  - name: "blog"
    label: "Blog"
    folder: "blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Category", name: "category", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Accès** : `https://geniuslab.ch/admin`

---

### Option 3 : Zapier / Make Automation ⭐⭐

**Avantages** :
- ✅ No-code complet
- ✅ Facile à configurer
- ✅ Nombreuses intégrations

**Comment ça marche** :
1. Stockez vos articles dans Google Docs ou Notion
2. Zapier/Make les publie automatiquement chaque semaine
3. Via l'API GitHub ou directement sur le serveur

**Workflow Zapier** :
```
Trigger: Schedule (Every Monday 9am)
  ↓
Action: Get next article from Google Sheets
  ↓
Action: Create file on GitHub
  ↓
Action: Trigger Railway redeploy
```

**Coût** : Gratuit jusqu'à 100 tâches/mois

---

### Option 4 : WordPress avec Headless CMS ⭐

**Avantages** :
- ✅ Interface familière
- ✅ Planification native
- ✅ Plugins puissants

**Comment ça marche** :
1. Installez WordPress (gratuit sur wordpress.com)
2. Utilisez l'API REST de WordPress
3. Votre site récupère les articles via l'API

**Code pour récupérer articles** :
```javascript
fetch('https://votre-blog.wordpress.com/wp-json/wp/v2/posts')
  .then(response => response.json())
  .then(posts => {
    // Afficher les articles sur votre site
  });
```

---

### Option 5 : Script Node.js Personnalisé ⭐⭐

**Avantages** :
- ✅ Contrôle total
- ✅ Personnalisable à 100%
- ✅ Peut tourner sur Railway

**Code exemple** :

Créez `scripts/publish-blog.js` :
```javascript
const fs = require('fs');
const path = require('path');

// Dossier des brouillons
const draftsDir = './blog-drafts';
const publishDir = './';

// Lire le prochain article à publier
const drafts = fs.readdirSync(draftsDir);
if (drafts.length === 0) {
  console.log('No more articles to publish');
  process.exit(0);
}

// Publier le premier article
const nextArticle = drafts[0];
const sourcePath = path.join(draftsDir, nextArticle);
const destPath = path.join(publishDir, nextArticle);

fs.renameSync(sourcePath, destPath);
console.log(`Published: ${nextArticle}`);

// Mettre à jour blog.html
updateBlogIndex(nextArticle);

function updateBlogIndex(articleFile) {
  // Lire le fichier article pour extraire titre, date, etc.
  const articleContent = fs.readFileSync(articleFile, 'utf8');
  
  // Extraire les métadonnées (titre, description)
  const title = articleContent.match(/<h1>(.*?)<\/h1>/)[1];
  const date = new Date().toLocaleDateString('fr-CH');
  
  // Lire blog.html
  let blogIndex = fs.readFileSync('blog.html', 'utf8');
  
  // Ajouter le nouvel article en haut de la liste
  const newCard = `
    <article class="blog-card">
      <div class="blog-meta">
        <span class="blog-date">📅 ${date}</span>
      </div>
      <h2><a href="${articleFile}">${title}</a></h2>
      <a href="${articleFile}" class="btn btn-secondary">Lire l'article →</a>
    </article>
  `;
  
  blogIndex = blogIndex.replace(
    '<div class="blog-grid">',
    `<div class="blog-grid">\n${newCard}`
  );
  
  fs.writeFileSync('blog.html', blogIndex);
}
```

**Automatisation avec cron** (sur Railway) :
```bash
# Tous les lundis à 9h
0 9 * * 1 node scripts/publish-blog.js && git add . && git commit -m "Auto-publish blog" && git push
```

---

## 📊 Comparaison des Solutions

| Solution | Difficulté | Coût | Flexibilité | Recommandé |
|----------|-----------|------|-------------|------------|
| GitHub Actions | Moyenne | Gratuit | Haute | ⭐⭐⭐ |
| Netlify CMS | Facile | Gratuit | Moyenne | ⭐⭐⭐ |
| Zapier/Make | Très facile | 20€/mois | Moyenne | ⭐⭐ |
| WordPress | Facile | Gratuit | Haute | ⭐ |
| Script Node.js | Difficile | Gratuit | Très haute | ⭐⭐ |

---

## 🎯 Ma Recommandation : GitHub Actions

**Pourquoi** :
- Gratuit
- S'intègre parfaitement avec votre workflow actuel
- Pas de dépendance externe
- Facile à maintenir

**Mise en place en 3 étapes** :

### Étape 1 : Créer le dossier des brouillons
```bash
mkdir blog-drafts
```

### Étape 2 : Préparer vos articles
Mettez tous vos articles futurs dans `blog-drafts/` avec des noms numérotés :
- `01-article-semaine-1.html`
- `02-article-semaine-2.html`
- etc.

### Étape 3 : Créer le workflow GitHub Actions
Créez `.github/workflows/publish-blog.yml` (code fourni ci-dessus)

**C'est tout !** Chaque lundi à 9h, un article sera publié automatiquement.

---

## 🔧 Alternative Simple : Buffer ou Hootsuite

Si vous voulez juste partager vos articles existants sur les réseaux sociaux :

**Buffer** (gratuit jusqu'à 3 comptes) :
- Planifiez vos posts à l'avance
- Publie automatiquement sur LinkedIn, Twitter, Facebook
- Inclut le lien vers votre article

**Hootsuite** (30€/mois) :
- Plus de fonctionnalités
- Analytics avancés

---

## 📅 Workflow Recommandé

**Une fois par mois** :
1. Écrivez 4 articles (1 par semaine)
2. Mettez-les dans `blog-drafts/`
3. Commit et push sur GitHub
4. GitHub Actions s'occupe du reste

**Chaque lundi à 9h** :
- ✅ Article publié automatiquement
- ✅ Site redéployé sur Railway
- ✅ Visible sur geniuslab.ch/blog.html

---

## 💡 Bonus : Idées d'Articles

Pour maintenir un rythme d'1 article/semaine :

**Semaine 1** : Tutoriel technique
**Semaine 2** : Success story / Case study
**Semaine 3** : Liste d'outils / ressources
**Semaine 4** : Opinion / Tendances

**Exemples de titres** :
- "10 Erreurs à Éviter en Créant sa Startup"
- "Comment j'ai Lancé mon SaaS en 30 Jours"
- "Les Meilleurs Outils IA pour Entrepreneurs en 2025"
- "Pourquoi la Suisse Est le Meilleur Pays pour les Startups"

---

**Besoin d'aide pour mettre en place GitHub Actions ?** Je peux créer le workflow complet pour vous ! 🚀
