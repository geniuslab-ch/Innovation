# 🤖 Système de Publication Automatique - Guide Complet

## ✅ Ce qui a été mis en place

### 1. Structure des dossiers
```
/blog-drafts/          → Articles à publier (HTML)
/.github/workflows/    → GitHub Actions
/scripts/              → Scripts d'automatisation
```

### 2. GitHub Actions
- **Fichier** : `.github/workflows/publish-blog.yml`
- **Déclenchement** : Tous les lundis à 9h (heure suisse)
- **Action** : Publie automatiquement le prochain article

### 3. Script de mise à jour
- **Fichier** : `scripts/update-blog-index.js`
- **Fonction** : Met à jour `blog.html` avec le nouvel article

---

## 📝 Comment convertir vos articles Word en HTML

Malheureusement, je ne peux pas lire directement les fichiers .docx. Voici 3 options :

### Option 1 : Conversion manuelle (Recommandée)

**Pour chaque article** :

1. **Ouvrez le fichier Word**
2. **Copiez tout le contenu** (Cmd+A, Cmd+C)
3. **Dites-moi** : "Convertis cet article : [collez le contenu]"
4. **Je créerai** le fichier HTML avec le bon design

**Avantage** : Contrôle total, design parfait

### Option 2 : Utiliser Pandoc (Automatique)

**Installation** :
```bash
brew install pandoc
```

**Script de conversion** :
```bash
cd "/Users/nourascharer/Desktop/Geniuslab v2/Innovation"

for file in "30 articles de blogs numéroté"/*.docx; do
  filename=$(basename "$file" .docx)
  pandoc "$file" -f docx -t html -o "blog-drafts/${filename}.html"
done
```

**Ensuite** : Vous devrez ajouter le design GeniusLab manuellement

### Option 3 : Conversion en ligne

1. **Allez sur** : https://www.zamzar.com/convert/docx-to-html/
2. **Uploadez vos fichiers Word**
3. **Téléchargez les HTML**
4. **Je les adapterai** au design GeniusLab

---

## 🚀 Workflow de Publication

### Automatique (Recommandé)

1. **Vous placez** les articles HTML dans `blog-drafts/`
2. **Chaque lundi à 9h**, GitHub Actions :
   - Prend le premier article (ordre alphabétique)
   - Le publie sur le site
   - Met à jour `blog.html`
   - Pousse les changements sur GitHub
   - Railway redéploie automatiquement

### Manuel (Pour tester)

```bash
# Publier un article manuellement
mv blog-drafts/01-article.html .
node scripts/update-blog-index.js "01-article.html" "Titre" "No-Code" "25 décembre 2025"
git add .
git commit -m "Publish: Article 01"
git push
```

---

## 📋 Template HTML pour vos articles

Voici le template à utiliser pour chaque article :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>[TITRE] | GeniusLab Blog</title>
  <meta name="description" content="[DESCRIPTION]">
  <link rel="canonical" href="https://geniuslab.ch/[FILENAME].html">
  
  <link rel="stylesheet" href="styles.css">
  
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-N5XBW5VJ');</script>
  
  <!-- Google Ads -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10825850251"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-10825850251');
  </script>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N5XBW5VJ" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <nav class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="index.html"><img src="logo.png" alt="GeniusLab" class="brand-logo" /></a>
      <div class="topbar-actions">
        <a class="toplink" href="index.html">Accueil</a>
        <a class="toplink" href="blog.html">Blog</a>
        <a class="toplink" href="faq.html">FAQ</a>
        <a class="btn btn-ghost" href="index.html#formulaire">S'inscrire</a>
      </div>
    </div>
  </nav>

  <article class="blog-article">
    <div class="container" style="max-width: 800px;">
      
      <header class="article-header">
        <div class="article-meta">
          <span>📅 [DATE]</span>
          <span class="blog-category">[CATEGORIE]</span>
        </div>
        <h1>[TITRE]</h1>
        <p class="article-intro">[INTRODUCTION]</p>
      </header>

      <div class="article-content">
        
        [CONTENU DE L'ARTICLE ICI]

        <div class="article-cta">
          <h3>Envie d'en savoir plus ?</h3>
          <p>Rejoignez notre formation et lancez votre startup.</p>
          <a href="index.html#formulaire" class="btn btn-primary">Postuler à la formation</a>
        </div>

      </div>

      <footer class="article-footer">
        <a href="blog.html" class="btn btn-secondary">← Retour au blog</a>
      </footer>

    </div>
  </article>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <img src="logo.png" alt="GeniusLab" class="footer-logo" />
        <div class="footer-meta">
          <div class="footer-title">GeniusLab</div>
          <div class="footer-sub">L'avenir de l'entrepreneuriat commence ici</div>
        </div>
      </div>
      <div class="footer-right">
        <a class="footer-link" href="index.html">Accueil</a>
        <a class="footer-link" href="blog.html">Blog</a>
        <a class="footer-link" href="faq.html">FAQ</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© 2025 GeniusLab. Tous droits réservés.</p>
    </div>
  </footer>

  <style>
    .blog-article {padding: 80px 0 60px;}
    .article-header {text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 1px solid rgba(168,85,247,.2);}
    .article-meta {display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;}
    .article-header h1 {font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 16px; line-height: 1.2;}
    .article-intro {font-size: 1.2rem; color: rgba(249,250,251,.8); max-width: 700px; margin: 0 auto;}
    .article-content {line-height: 1.8; color: rgba(249,250,251,.9);}
    .article-content h2 {font-size: 2rem; margin: 50px 0 20px; padding-top: 20px; border-top: 2px solid rgba(168,85,247,.3);}
    .article-content h3 {font-size: 1.5rem; margin: 30px 0 15px; color: var(--g3);}
    .article-content p {margin-bottom: 20px;}
    .article-content ul, .article-content ol {margin: 20px 0 20px 30px;}
    .article-content li {margin-bottom: 12px;}
    .article-content strong {color: var(--text); font-weight: 700;}
    .article-cta {background: linear-gradient(135deg, rgba(34,211,238,.15), rgba(168,85,247,.15)); border: 1px solid rgba(168,85,247,.3); border-radius: var(--r-lg); padding: 40px; text-align: center; margin: 60px 0 40px;}
    .article-cta h3 {font-size: 1.8rem; margin-bottom: 12px;}
    .article-cta p {margin-bottom: 24px; font-size: 1.1rem;}
    .article-footer {margin-top: 60px; padding-top: 30px; border-top: 1px solid rgba(168,85,247,.2);}
  </style>
</body>
</html>
```

---

## 🎯 Prochaines Étapes

### Immédiat
1. **Choisissez** une méthode de conversion (Option 1, 2 ou 3)
2. **Convertissez** vos 30 articles en HTML
3. **Placez-les** dans `blog-drafts/`
4. **Testez** avec le premier article

### Ensuite
- GitHub Actions publiera automatiquement 1 article/lundi
- Vous n'aurez plus rien à faire pendant 30 semaines !

---

## 💡 Besoin d'aide ?

**Pour convertir un article** :
- Envoyez-moi le contenu texte
- Je créerai le HTML avec le bon design

**Pour tester** :
```bash
# Déclencher manuellement GitHub Actions
gh workflow run publish-blog.yml
```

---

**Système prêt !** Il ne reste plus qu'à convertir les articles 🚀
