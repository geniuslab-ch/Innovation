# 🔍 Guide SEO - Nettoyer les anciennes pages Google

## Problème actuel

Google affiche encore les anciennes pages de votre site brainstorming :
- `/entrez-en-contact-avec-un-expert`
- `/a-propos-de-nous-pensee-creative`
- `/lancement`
- `/brainstorming`
- `/business-plan`
- `/nos-e-books`

## ✅ Solutions mises en place

### 1. Redirections 301 (.htaccess)

**Fichier créé** : `.htaccess`

Ce fichier redirige automatiquement toutes les anciennes URLs vers votre nouveau site. Les redirections 301 indiquent à Google que les pages ont **définitivement** changé d'adresse.

**Déploiement** : Uploadez le fichier `.htaccess` à la racine de votre site Infomaniak.

---

## 🚀 Actions à faire manuellement

### 2. Google Search Console (IMPORTANT)

**Étape 1 : Vérifier la propriété du domaine**

1. Allez sur [Google Search Console](https://search.google.com/search-console)
2. Ajoutez `geniuslab.ch` si ce n'est pas déjà fait
3. Vérifiez la propriété via DNS (Infomaniak)

**Étape 2 : Supprimer les anciennes URLs**

1. Dans Search Console, allez dans **Suppressions**
2. Cliquez sur **Nouvelle demande**
3. Ajoutez chaque ancienne URL :
   - `https://geniuslab.ch/entrez-en-contact-avec-un-expert`
   - `https://geniuslab.ch/a-propos-de-nous-pensee-creative`
   - `https://geniuslab.ch/lancement`
   - `https://geniuslab.ch/brainstorming`
   - `https://geniuslab.ch/business-plan`
   - `https://geniuslab.ch/nos-e-books`

**Étape 3 : Demander une réindexation**

1. Dans Search Console, allez dans **Inspection d'URL**
2. Entrez `https://geniuslab.ch`
3. Cliquez sur **Demander une indexation**
4. Répétez pour :
   - `https://geniuslab.ch/blog.html`
   - `https://geniuslab.ch/faq.html`

---

### 3. Sitemap XML

**Créer un sitemap** pour aider Google à indexer vos nouvelles pages :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://geniuslab.ch/</loc>
    <lastmod>2025-12-26</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://geniuslab.ch/blog.html</loc>
    <lastmod>2025-12-26</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://geniuslab.ch/faq.html</loc>
    <lastmod>2025-12-26</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://geniuslab.ch/mentions-legales.html</loc>
    <lastmod>2025-12-26</lastmod>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://geniuslab.ch/politique-confidentialite.html</loc>
    <lastmod>2025-12-26</lastmod>
    <priority>0.3</priority>
  </url>
</urlset>
```

**Soumettre le sitemap** :
1. Sauvegardez ce fichier comme `sitemap.xml`
2. Uploadez-le à la racine de votre site
3. Dans Search Console : **Sitemaps** → Ajouter `https://geniuslab.ch/sitemap.xml`

---

### 4. Robots.txt

**Créer un fichier `robots.txt`** pour guider les robots Google :

```
User-agent: *
Allow: /
Disallow: /blog-drafts/
Disallow: /scripts/

Sitemap: https://geniuslab.ch/sitemap.xml
```

---

## ⏱️ Délais de mise à jour Google

- **Redirections 301** : Effet immédiat (dès que déployé)
- **Suppressions Search Console** : 24-48 heures
- **Réindexation complète** : 1-2 semaines
- **Disparition totale anciennes pages** : 2-4 semaines

---

## 📊 Vérification

**Après 48h, vérifiez** :

1. **Test de redirection** : Tapez une ancienne URL → doit rediriger vers index.html
2. **Google Search** : Recherchez `site:geniuslab.ch brainstorming` → devrait diminuer
3. **Search Console** : Vérifiez les erreurs 404

---

## 🎯 Optimisation SEO supplémentaire

### Améliorer le référencement du nouveau site

**1. Meta descriptions uniques**
- ✅ Déjà fait sur toutes les pages

**2. Backlinks**
- Mettez à jour vos profils réseaux sociaux avec la nouvelle URL
- Contactez les sites qui lient vers votre ancien site

**3. Google My Business**
- Mettez à jour votre fiche Google avec la nouvelle description
- Ajoutez des photos de vos formations

**4. Contenu régulier**
- ✅ 30 articles de blog programmés (1/semaine)
- Cela va booster votre SEO naturellement

---

## 📞 Support Infomaniak

Si vous avez des difficultés avec le `.htaccess` :

**Support Infomaniak** : https://www.infomaniak.com/fr/support
**Documentation redirections** : https://www.infomaniak.com/fr/support/faq/2298

---

## ✅ Checklist

- [ ] Uploader `.htaccess` sur Infomaniak
- [ ] Créer compte Google Search Console
- [ ] Vérifier propriété domaine
- [ ] Supprimer anciennes URLs
- [ ] Demander réindexation nouvelles pages
- [ ] Créer et soumettre sitemap.xml
- [ ] Créer robots.txt
- [ ] Mettre à jour Google My Business
- [ ] Attendre 2-4 semaines pour nettoyage complet

---

**Résultat attendu** : Dans 2-4 semaines, seules vos nouvelles pages (formation, blog, FAQ) apparaîtront dans Google ! 🎉
