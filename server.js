require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Servir les fichiers HTML/CSS/JS

// Endpoint pour créer une session Checkout
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { email, name, phone } = req.body;

        // Créer une session Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'chf',
                        product_data: {
                            name: 'Formation Innovation & Entrepreneuriat',
                            description: 'Formation intensive de 4 heures - GeniusLab',
                            images: ['https://via.placeholder.com/300'], // Remplacez par votre logo si hébergé
                        },
                        unit_amount: 30000, // 300 CHF en centimes
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/confirmation.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/paiement.html`,
            customer_email: email,
            metadata: {
                customer_name: name,
                customer_phone: phone,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour vérifier le statut d'une session (optionnel)
app.get('/checkout-session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json(session);
    } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook pour recevoir les événements Stripe (optionnel mais recommandé)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Erreur webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer les événements
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Paiement réussi pour:', session.customer_email);
            // Ici vous pouvez envoyer un email de confirmation, enregistrer dans une DB, etc.
            break;
        case 'payment_intent.succeeded':
            console.log('✅ PaymentIntent réussi');
            break;
        default:
            console.log(`Event non géré: ${event.type}`);
    }

    res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Serveur GeniusLab démarré avec succès !          ║
║                                                        ║
║   📍 URL locale: http://localhost:${PORT}                ║
║                                                        ║
║   📄 Pages disponibles:                                ║
║   • Landing page: http://localhost:${PORT}/index.html     ║
║   • Paiement:     http://localhost:${PORT}/paiement.html  ║
║   • Confirmation: http://localhost:${PORT}/confirmation.html ║
║                                                        ║
║   💳 Mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_test') ? 'TEST' : 'PRODUCTION'}                              ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
