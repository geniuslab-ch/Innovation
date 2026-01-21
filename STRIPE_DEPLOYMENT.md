# Guide de Déploiement - Stripe Checkout API

## Prérequis

1. **Compte Stripe** avec clés API :
   - Clé secrète : `sk_test_...` (test) ou `sk_live_...` (production)
   - Clé publique : `pk_test_...` (test) ou `pk_live_...` (production)

2. **Compte Cloudflare** avec Workers activé

3. **Node.js** installé (>= 18.0.0)

## Étapes de Déploiement

### 1. Installer les dépendances

```bash
cd "/Users/nourascharer/Desktop/Geniuslab v2/Innovation"
npm install
```

### 2. Configurer la clé secrète Stripe

**IMPORTANT** : Ne jamais commit la clé secrète dans Git !

```bash
# Se connecter à Cloudflare
npx wrangler login

# Définir la clé secrète Stripe
npx wrangler secret put STRIPE_SECRET_KEY
# Coller votre clé: sk_test_... ou sk_live_...
```

### 3. Mettre à jour wrangler.toml

Ouvrez `wrangler.toml` et ajoutez votre clé publique Stripe :

```toml
[vars]
STRIPE_PUBLISHABLE_KEY = "pk_test_..."  # Remplacez par votre vraie clé
```

### 4. Tester en local

```bash
npm run worker:dev
```

L'API sera accessible sur `http://localhost:8787`

### 5. Tester l'API

```bash
curl -X POST http://localhost:8787/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "CHF",
    "format": "Présentiel",
    "date": "2026-01-25",
    "time": "9h-13h"
  }'
```

Vous devriez recevoir une réponse avec `sessionId` et `url`.

### 6. Déployer sur Cloudflare

```bash
npm run worker:deploy
```

Notez l'URL de votre worker (ex: `https://geniuslab-stripe-checkout.your-subdomain.workers.dev`)

### 7. Mettre à jour paiement.html

Dans `paiement.html`, remplacez `WORKER_URL` par l'URL de votre worker :

```javascript
const WORKER_URL = 'https://geniuslab-stripe-checkout.your-subdomain.workers.dev/create-checkout-session';
```

### 8. Tester le flux complet

1. Ouvrir https://geniuslab.ch
2. Remplir le QCM
3. Sélectionner une date
4. Cliquer sur "Continuer vers le paiement"
5. Vérifier que le paiement Stripe s'ouvre avec le bon prix et devise

## Vérifications

✅ Le worker est déployé sur Cloudflare
✅ La clé secrète Stripe est configurée
✅ L'URL du worker est mise à jour dans paiement.html
✅ Les prix correspondent : CHF 300, EUR 279, USD 321
✅ Les métadonnées (date, format) apparaissent dans Stripe Dashboard

## Dépannage

### Erreur "Invalid API Key"
- Vérifiez que la clé secrète est bien configurée : `npx wrangler secret list`
- Assurez-vous d'utiliser `sk_test_` ou `sk_live_` (pas `pk_`)

### Erreur CORS
- Vérifiez que `CORS_HEADERS` inclut votre domaine
- Testez avec `curl` pour isoler le problème

### Session non créée
- Vérifiez les logs : `npx wrangler tail`
- Assurez-vous que la clé Stripe est active dans votre compte

## URLs Importantes

- Worker local : http://localhost:8787
- Worker production : (sera fourni après déploiement)
- Stripe Dashboard : https://dashboard.stripe.com
- Cloudflare Dashboard : https://dash.cloudflare.com
