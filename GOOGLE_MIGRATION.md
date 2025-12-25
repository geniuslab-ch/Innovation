# Guide : Remplacer l'Ancien Site par le Nouveau dans Google

## 🎯 Objectif
Faire disparaître l'ancien site GeniusLab des résultats Google et le remplacer par le nouveau (geniuslab.ch).

---

## ✅ Actions Immédiates

### 1. Demander la Suppression de l'Ancienne URL

**Si vous contrôlez encore l'ancien site :**

1. **Ajoutez une redirection 301** de l'ancien site vers `https://geniuslab.ch`
   - C'est la méthode la plus efficace
   - Google transférera automatiquement le "jus SEO"
   
2. **Ou ajoutez cette balise** dans le `<head>` de l'ancien site :
   ```html
   <meta name="robots" content="noindex, nofollow">
   <link rel="canonical" href="https://geniuslab.ch/">
   ```

**Si vous ne contrôlez plus l'ancien site :**

1. Allez sur **Google Search Console**
2. Menu **Suppressions** (ou "Removals")
3. **Nouvelle demande** > Supprimer temporairement l'URL
4. Entrez l'URL de l'ancien site
5. **Soumettre**

⚠️ **Note** : La suppression temporaire dure 6 mois. Pour une suppression permanente, il faut contrôler le site.

---

### 2. Accélérer l'Indexation du Nouveau Site

**Dans Google Search Console :**

1. **Inspection d'URL** (barre de recherche en haut)
2. Entrez : `https://geniuslab.ch`
3. Cliquez sur **"Demander une indexation"**
4. Répétez pour :
   - `https://geniuslab.ch/index.html`
   - `https://geniuslab.ch/paiement.html`

**Résultat** : Google crawlera votre nouveau site en quelques heures au lieu de quelques jours.

---

### 3. Créer du Contenu Frais

Google favorise le contenu récent. Ajoutez :

- **Blog** avec articles récents
- **Actualités** sur la formation
- **Témoignages** datés
- **FAQ** mise à jour

---

### 4. Obtenir des Backlinks vers le Nouveau Site

Plus il y a de liens pointant vers `geniuslab.ch`, plus Google le considérera comme la source officielle.

**Actions rapides :**
- ✅ **Google My Business** : Assurez-vous que l'URL est `geniuslab.ch`
- ✅ **Réseaux sociaux** : Mettez à jour tous les liens (LinkedIn, Facebook, Instagram, etc.)
- ✅ **Annuaires** : Inscrivez-vous sur :
  - local.ch
  - search.ch
  - yelp.ch
  - startups.ch
- ✅ **Partenaires** : Demandez-leur de mettre à jour leurs liens

---

### 5. Utiliser Google My Business

Dans votre fiche GMB :
1. **Site web** : `https://geniuslab.ch`
2. **Lien de réservation** : `https://geniuslab.ch/#formulaire`
3. **Publiez régulièrement** des posts avec le lien du nouveau site

---

## ⏱️ Délais Attendus

| Action | Délai |
|--------|-------|
| Demande d'indexation | 1-3 jours |
| Suppression temporaire ancienne URL | 1-2 jours |
| Remplacement dans résultats | 1-2 semaines |
| Transfert complet du ranking | 1-3 mois |

---

## 🔍 Vérifier la Progression

### Commande Google
Tapez dans Google :
```
site:geniuslab.ch
```
Vous verrez toutes les pages indexées de votre nouveau site.

### Comparer avec l'ancien
```
site:ancien-domaine.com
```
Le nombre de résultats devrait diminuer progressivement.

---

## 🚨 Si l'Ancien Site Persiste

### Option 1 : Contacter le Propriétaire
Si quelqu'un d'autre contrôle l'ancien site, demandez-lui de :
- Supprimer le contenu
- Ou ajouter une redirection vers votre nouveau site

### Option 2 : Signaler à Google
Si l'ancien site utilise votre marque sans autorisation :
1. **Google DMCA** : https://support.google.com/legal/answer/3110420
2. Signalez une violation de marque

### Option 3 : Renforcer le Nouveau
- Publiez plus de contenu
- Obtenez plus de backlinks
- Soyez actif sur les réseaux sociaux
- Google finira par privilégier le site le plus actif

---

## 📊 Checklist Complète

**Fait :**
- [x] Nouveau site en ligne (geniuslab.ch)
- [x] SEO optimisé
- [x] Sitemap créé
- [x] Google My Business créé

**À faire :**
- [ ] Vérifier propriété dans Google Search Console
- [ ] Soumettre sitemap.xml
- [ ] Demander indexation des pages principales
- [ ] Demander suppression ancien site (si possible)
- [ ] Mettre à jour liens réseaux sociaux
- [ ] S'inscrire sur annuaires suisses
- [ ] Publier 2-3 posts GMB par semaine
- [ ] Créer 1-2 articles de blog par mois

---

## 💡 Astuce Pro

**Créez une page "À propos" ou "Notre histoire"** mentionnant explicitement :
> "GeniusLab est une formation suisse en innovation et entrepreneuriat, basée à [ville]. Nous avons lancé notre nouveau site en décembre 2025 pour mieux servir nos participants."

Cela aide Google à comprendre que c'est le site officiel actuel.

---

**Dernière mise à jour** : 25 décembre 2025
