# 🔧 Configuration Hébergement - GeniusLab

## Situation actuelle

**Votre configuration** :
- ✅ **Domaine** : geniuslab.ch (chez Infomaniak)
- ✅ **Hébergement** : Railway (déploiement automatique depuis GitHub)
- ✅ **DNS** : Pointe vers Railway

## ⚠️ Problème avec .htaccess

Le fichier `.htaccess` ne fonctionne **que sur Apache** (serveurs traditionnels comme Infomaniak).

**Railway utilise Nginx/Node.js**, donc `.htaccess` est ignoré.

---

## ✅ Solution : Fichier _redirects

J'ai créé un fichier `_redirects` compatible Railway.

**Ce fichier fait la même chose que .htaccess** :
- Redirige les anciennes URLs vers les nouvelles
- Force HTTPS
- Fonctionne sur Railway

---

## 📋 Prochaines étapes

### 1. Déployer le fichier _redirects

Le fichier est déjà dans votre projet. Il sera automatiquement déployé sur Railway au prochain push Git.

**Vérification** :
```bash
git status
```

Vous devriez voir `_redirects` dans les fichiers modifiés.

### 2. Commit et push

```bash
git add _redirects
git commit -m "Config: Redirections Railway pour anciennes URLs"
git push origin main
```

### 3. Attendre le redéploiement Railway

- Railway va automatiquement redéployer (1-2 minutes)
- Les redirections seront actives

### 4. Tester

Après le déploiement, testez :
- https://geniuslab.ch/brainstorming → devrait rediriger vers index.html
- https://geniuslab.ch/lancement → devrait rediriger vers index.html

---

## 🎯 Alternative : Configuration Railway

Si `_redirects` ne fonctionne pas, on peut aussi configurer les redirections directement dans Railway.

**Dans Railway Dashboard** :
1. Allez sur votre projet
2. Settings → Variables
3. Ajoutez une configuration de redirections

Mais essayons d'abord avec `_redirects` qui est plus simple.

---

## 📊 Récapitulatif

| Méthode | Serveur | Statut |
|---------|---------|--------|
| `.htaccess` | Apache (Infomaniak) | ❌ Ne fonctionne pas (vous n'êtes pas hébergé là) |
| `_redirects` | Railway/Netlify | ✅ Solution recommandée |
| Configuration Railway | Railway | ✅ Alternative si _redirects ne marche pas |

---

## ❓ Votre configuration DNS

**Question importante** : Où pointe votre domaine geniuslab.ch ?

**Pour vérifier** :
1. Allez sur Infomaniak → Domaines → geniuslab.ch
2. Regardez les enregistrements DNS
3. Cherchez un enregistrement A ou CNAME

**Si le DNS pointe vers** :
- ✅ **Railway** → Utilisez `_redirects` (solution ci-dessus)
- ⚠️ **Infomaniak** → Vous devez soit :
  - Changer le DNS pour pointer vers Railway
  - OU héberger sur Infomaniak au lieu de Railway

---

**Dites-moi si vous voulez que je vous aide à commit et push le fichier _redirects !** 😊
