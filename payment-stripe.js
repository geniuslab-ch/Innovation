/**
 * GeniusLab - Payment Page Dynamic Stripe Integration
 * Handles checkout session creation via Cloudflare Worker API
 */

// Configuration - UPDATE THIS URL after deploying the worker
const WORKER_URL = 'https://geniuslab-stripe-checkout.YOUR-SUBDOMAIN.workers.dev/create-checkout-session';

/**
 * Get current currency from localStorage or default to CHF
 */
function getCurrentCurrency() {
    try {
        const cachedCurrency = localStorage.getItem('geniuslab_currency');
        return cachedCurrency || 'CHF';
    } catch (e) {
        console.warn('[Payment] Could not get currency from localStorage:', e);
        return 'CHF';
    }
}

/**
 * Load selected date from localStorage
 */
function loadSelectedDate() {
    try {
        const selectedDateStr = localStorage.getItem('geniuslab_selected_date');

        if (!selectedDateStr) {
            showNoSelectionMessage();
            return;
        }

        const selectedDate = JSON.parse(selectedDateStr);
        console.log('[Payment] Loaded selected date:', selectedDate);

        displayDateSummary(selectedDate);
        setupPaymentButton(selectedDate);

    } catch (error) {
        console.error('[Payment] Error loading selected date:', error);
        showNoSelectionMessage();
    }
}

/**
 * Display the date summary
 */
function displayDateSummary(dateInfo) {
    const container = document.getElementById('selection-summary');

    // Format the date in French (parse as local date to avoid timezone issues)
    const [year, month, day] = dateInfo.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const icon = dateInfo.type === 'Présentiel' ? '📍' : '💻';

    const html = `
        <div class="selection-header">
            <span class="selection-icon">${icon}</span>
            <div class="selection-title">
                <h3>${dateInfo.type}</h3>
                <p class="selection-subtitle">Votre session de formation</p>
            </div>
        </div>
        
        <div class="selection-details">
            <div class="selection-detail-row">
                <span class="selection-detail-icon">📅</span>
                <div class="selection-detail-content">
                    <strong>Date de la formation</strong>
                    <p>${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</p>
                </div>
            </div>
            
            <div class="selection-detail-row">
                <span class="selection-detail-icon">⏰</span>
                <div class="selection-detail-content">
                    <strong>Horaires</strong>
                    <p>${dateInfo.time}</p>
                </div>
            </div>
            
            <div class="selection-detail-row">
                <span class="selection-detail-icon">${icon}</span>
                <div class="selection-detail-content">
                    <strong>Format</strong>
                    <p>${dateInfo.type === 'Présentiel' ? 'En présentiel (lieu confirmé par email)' : 'À distance via Google Meet (lien envoyé 48h avant)'}</p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Setup payment button to call Stripe Checkout API
 */
async function setupPaymentButton(dateInfo) {
    const buttonContainer = document.getElementById('payment-button-container');
    const paymentLink = document.getElementById('stripe-payment-link');

    // Show button container
    buttonContainer.style.display = 'block';

    // Get current currency
    const currency = getCurrentCurrency();
    console.log('[Payment] Currency detected:', currency);

    // Update button text with correct currency
    updatePaymentButtonText(currency);

    // Add click handler to create Stripe session
    paymentLink.addEventListener('click', async function (e) {
        e.preventDefault();

        // Disable button and show loading
        this.classList.add('loading');
        this.innerHTML = '<span class="spinner"></span> Création de la session de paiement...';

        try {
            console.log('[Payment] Creating checkout session...');
            console.log('[Payment] Request:', { currency, format: dateInfo.type, date: dateInfo.date, time: dateInfo.time });

            // Call worker API to create Stripe checkout session
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currency: currency,
                    format: dateInfo.type,
                    date: dateInfo.date,
                    time: dateInfo.time
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[Payment] API Error:', response.status, errorData);
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('[Payment] Checkout session created:', data);

            if (data.url) {
                console.log('[Payment] Redirecting to Stripe Checkout:', data.url);
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received from API');
            }

        } catch (error) {
            console.error('[Payment] Error creating checkout session:', error);

            // Show user-friendly error message
            const errorMsg = error.message || 'Erreur inconnue';
            alert(`Erreur lors de la création de la session de paiement.\n\nDétails: ${errorMsg}\n\nVeuillez réessayer ou contactez-nous si le problème persiste.`);

            // Re-enable button
            this.classList.remove('loading');
            updatePaymentButtonText(currency);
        }
    });

    console.log('[Payment] Payment button configured -', 'Type:', dateInfo.type, 'Currency:', currency);
}

/**
 * Update payment button text with correct currency and amount
 */
function updatePaymentButtonText(currency) {
    const paymentLink = document.getElementById('stripe-payment-link');
    const paymentAmount = document.getElementById('payment-amount');

    const amounts = {
        'CHF': '300 CHF',
        'EUR': '279 €',
        'USD': '$321'
    };

    if (paymentAmount) {
        paymentAmount.textContent = amounts[currency] || '300 CHF';
    } else if (paymentLink) {
        paymentLink.innerHTML = `Finaliser le paiement - ${amounts[currency] || '300 CHF'} →`;
    }
}

/**
 * Show message when no date is selected
 */
function showNoSelectionMessage() {
    const container = document.getElementById('selection-summary');
    container.innerHTML = `
        <div class="no-selection-message">
            <h3>⚠️ Aucune date sélectionnée</h3>
            <p>Vous devez d'abord sélectionner une date de formation avant de procéder au paiement.</p>
            <a href="index.html#formulaire" class="btn btn-primary">
                Retour à la sélection de date
            </a>
        </div>
    `;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', loadSelectedDate);
