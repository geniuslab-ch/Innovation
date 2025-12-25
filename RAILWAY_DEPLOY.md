# 🚂 Déploiement Backend sur Railway

## Étape 1 : Préparer le projet

✅ Votre projet est déjà prêt avec :
- `server.js` - Serveur Express
- `package.json` - Dépendances
- `.gitignore` - Fichiers à ignorer

## Étape 2 : Créer un compte Railway

1. Allez sur https://railway.app
2. Cliquez sur "Start a New Project"
3. Connectez-vous avec GitHub

## Étape 3 : Déployer depuis GitHub

1. **Cliquez sur "Deploy from GitHub repo"**
2. **Sélectionnez** : `geniuslab-ch/Innovation`
3. **Railway détectera automatiquement** Node.js et installera les dépendances

## Étape 4 : Configurer les variables d'environnement

Dans Railway, allez dans l'onglet **Variables** et ajoutez :

```
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_TEST
STRIPE_PUBLIC_KEY=pk_test_51QbEb8Dw2d8nxNzV1rJjuY5rCVaY9IUohsMGLO7Tvd2plFIx3E0MwlBxXFeqTWAl5KaadrnyTK6oHRS7REG1aasT00THNZIjhg
PORT=3000
```

⚠️ **Important** : Utilisez vos vraies clés Stripe (test ou live)

## Étape 5 : Obtenir l'URL de votre backend

Après le déploiement, Railway vous donnera une URL comme :
```
https://votre-projet.up.railway.app
```

## Étape 6 : Mettre à jour les pages frontend

Vous devrez mettre à jour `paiement.html` pour utiliser l'URL Railway au lieu de `localhost:3000`.

### Option A : Utiliser l'URL Railway directement

Dans `paiement.html`, remplacez :
```javascript
const response = await fetch('/create-checkout-session', {
```

Par :
```javascript
const response = await fetch('https://votre-projet.up.railway.app/create-checkout-session', {
```

### Option B : Déployer aussi le frontend sur Railway (Recommandé)

Railway servira automatiquement vos fichiers HTML statiques avec le backend.

## Étape 7 : Configurer le domaine personnalisé (geniuslab.ch)

### Sur Railway :
1. Allez dans **Settings** > **Domains**
2. Cliquez sur **Custom Domain**
3. Entrez : `geniuslab.ch`
4. Railway vous donnera des enregistrements DNS

### Chez votre registrar de domaine :
1. Ajoutez un enregistrement **CNAME** :
   - Name: `@` ou `www`
   - Value: `votre-projet.up.railway.app`
2. Attendez la propagation DNS (peut prendre jusqu'à 48h)

## Étape 8 : Tester le déploiement

1. Visitez : `https://votre-projet.up.railway.app`
2. Testez la page de paiement : `https://votre-projet.up.railway.app/paiement.html`
3. Vérifiez que le paiement fonctionne avec la carte de test : `4242 4242 4242 4242`

## 🔧 Commandes utiles

### Voir les logs en temps réel
Dans Railway, allez dans l'onglet **Deployments** puis cliquez sur le déploiement actif.

### Redéployer
Chaque push sur GitHub déclenchera automatiquement un nouveau déploiement.

## ⚠️ Checklist avant de passer en production

- [ ] Remplacer les clés Stripe test par les clés live
- [ ] Configurer les webhooks Stripe
- [ ] Tester tous les flux de paiement
- [ ] Vérifier que le domaine personnalisé fonctionne
- [ ] Activer HTTPS (Railway le fait automatiquement)

## 🆘 Problèmes courants

### Le serveur ne démarre pas
- Vérifiez que `PORT` est bien configuré dans les variables d'environnement
- Vérifiez les logs dans Railway

### Erreur 401 Stripe
- Vérifiez que `STRIPE_SECRET_KEY` est correctement configurée
- Assurez-vous d'utiliser la bonne clé (test vs live)

### CORS errors
Le serveur est déjà configuré pour servir les fichiers statiques, donc pas de problème CORS.

## 📞 Support

- Documentation Railway : https://docs.railway.app
- Support Railway : https://railway.app/help
- Documentation Stripe : https://stripe.com/docs
