/**
 * GeniusLab - Stripe Checkout Worker
 * Creates dynamic Stripe Checkout sessions with multi-currency support
 * Supports: CHF, EUR, USD
 */

// Price configuration (amounts in cents/smallest currency unit)
const PRICES = {
    'Présentiel': {
        CHF: { amount: 30000, currency: 'chf' },  // 300.00 CHF
        EUR: { amount: 27900, currency: 'eur' },  // 279.00 EUR
        USD: { amount: 32100, currency: 'usd' }   // 321.00 USD
    },
    'Google Meet': {
        CHF: { amount: 30000, currency: 'chf' },  // 300.00 CHF
        EUR: { amount: 27900, currency: 'eur' },  // 279.00 EUR
        USD: { amount: 32100, currency: 'usd' }   // 321.00 USD
    }
};

// Product names
const PRODUCT_NAMES = {
    'Présentiel': 'Formation Innovation & Entrepreneuriat - Présentiel',
    'Google Meet': 'Formation Innovation & Entrepreneuriat - À distance'
};

// CORS headers
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Handle incoming requests
 */
export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: CORS_HEADERS
            });
        }

        // Only accept POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });
        }

        try {
            // Parse request body
            const body = await request.json();
            const { currency, format, date, time } = body;

            // Validate inputs
            if (!currency || !format) {
                return new Response(JSON.stringify({
                    error: 'Missing required fields: currency, format'
                }), {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                });
            }

            // Validate currency
            if (!['CHF', 'EUR', 'USD'].includes(currency)) {
                return new Response(JSON.stringify({
                    error: 'Invalid currency. Must be CHF, EUR, or USD'
                }), {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                });
            }

            // Validate format
            if (!['Présentiel', 'Google Meet'].includes(format)) {
                return new Response(JSON.stringify({
                    error: 'Invalid format. Must be Présentiel or Google Meet'
                }), {
                    status: 400,
                    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
                });
            }

            // Get price info
            const priceInfo = PRICES[format][currency];
            const productName = PRODUCT_NAMES[format];

            // Create Stripe Checkout session
            const session = await createCheckoutSession(
                env.STRIPE_SECRET_KEY,
                priceInfo,
                productName,
                format,
                date,
                time
            );

            // Return session info
            return new Response(JSON.stringify({
                sessionId: session.id,
                url: session.url
            }), {
                status: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Error creating checkout session:', error);
            return new Response(JSON.stringify({
                error: 'Failed to create checkout session',
                details: error.message
            }), {
                status: 500,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
            });
        }
    }
};

/**
 * Create a Stripe Checkout session
 */
async function createCheckoutSession(secretKey, priceInfo, productName, format, date, time) {
    const stripe = await import('stripe').then(m => m.default(secretKey));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: priceInfo.currency,
                    product_data: {
                        name: productName,
                        description: date && time ? `Session: ${date} (${time})` : 'Formation intensive 4h',
                    },
                    unit_amount: priceInfo.amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://geniuslab.ch/confirmation.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://geniuslab.ch/paiement.html',
        metadata: {
            format: format,
            date: date || 'Non spécifiée',
            time: time || 'Non spécifié'
        }
    });

    return session;
}
