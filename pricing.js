/**
 * GeniusLab - Dynamic Pricing System
 * Détecte la localisation de l'utilisateur et affiche les prix dans la devise appropriée
 * CHF (Suisse), EUR (Europe), USD (Reste du monde)
 */

const PRICING_CONFIG = {
  base: 300, // Prix de base en CHF
  currencies: {
    CHF: { 
      rate: 1.00, 
      symbol: 'CHF', 
      countries: ['CH'] 
    },
    EUR: { 
      rate: 0.93, 
      symbol: '€', 
      countries: [
        'FR', 'DE', 'IT', 'BE', 'AT', 'NL', 'ES', 'PT', 'IE', 'LU', 
        'GR', 'FI', 'SE', 'DK', 'NO', 'PL', 'CZ', 'HU', 'RO', 'BG', 
        'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'CY', 'MT'
      ] 
    },
    USD: { 
      rate: 1.07, 
      symbol: '$', 
      countries: [] // Default pour le reste du monde
    }
  }
};

/**
 * Détecte la devise appropriée basée sur le code pays
 */
function getCurrencyForCountry(countryCode) {
  if (!countryCode) return 'CHF'; // Fallback par défaut
  
  const upperCode = countryCode.toUpperCase();
  
  // Vérifier Suisse
  if (PRICING_CONFIG.currencies.CHF.countries.includes(upperCode)) {
    return 'CHF';
  }
  
  // Vérifier Europe
  if (PRICING_CONFIG.currencies.EUR.countries.includes(upperCode)) {
    return 'EUR';
  }
  
  // Par défaut: USD
  return 'USD';
}

/**
 * Calcule le prix dans la devise spécifiée
 */
function calculatePrice(basePrice, currency) {
  const rate = PRICING_CONFIG.currencies[currency].rate;
  const convertedPrice = basePrice * rate;
  
  // Arrondir à l'entier le plus proche pour une meilleure lisibilité
  return Math.round(convertedPrice);
}

/**
 * Formate le prix avec le symbole de devise
 */
function formatPrice(price, currency) {
  const symbol = PRICING_CONFIG.currencies[currency].symbol;
  
  if (currency === 'EUR') {
    return `${price} ${symbol}`;
  }
  return `${price} ${symbol}`;
}

/**
 * Met à jour tous les éléments de prix sur la page
 */
function updateAllPrices(currency) {
  console.log(`[GeniusLab Pricing] Mise à jour des prix en ${currency}`);
  
  // Tous les éléments avec la classe dynamic-price
  const priceElements = document.querySelectorAll('.dynamic-price');
  
  priceElements.forEach(element => {
    const basePrice = parseInt(element.getAttribute('data-price-base'));
    const priceType = element.getAttribute('data-price-type') || 'regular';
    
    if (!basePrice) {
      console.warn('[GeniusLab Pricing] Élément sans data-price-base:', element);
      return;
    }
    
    // Calculer le prix converti
    let finalPrice = calculatePrice(basePrice, currency);
    
    // Appliquer la réduction si c'est un prix réduit (-10%)
    if (priceType === 'discounted') {
      finalPrice = Math.round(finalPrice * 0.9);
    }
    
    // Mettre à jour le contenu
    element.textContent = formatPrice(finalPrice, currency);
  });
  
  // Mettre à jour le Schema.org structured data
  updateStructuredData(currency);
  
  console.log(`[GeniusLab Pricing] ${priceElements.length} prix mis à jour`);
}

/**
 * Met à jour les données structurées JSON-LD
 */
function updateStructuredData(currency) {
  try {
    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      const data = JSON.parse(scriptTag.textContent);
      if (data.offers) {
        const price = calculatePrice(PRICING_CONFIG.base, currency);
        data.offers.price = price.toString();
        data.offers.priceCurrency = currency;
        scriptTag.textContent = JSON.stringify(data, null, 2);
        console.log('[GeniusLab Pricing] Schema.org mis à jour');
      }
    }
  } catch (e) {
    console.error('[GeniusLab Pricing] Erreur mise à jour Schema.org:', e);
  }
}

/**
 * Détecte la localisation de l'utilisateur via l'API ipapi.co
 */
async function detectUserLocation() {
  // Vérifier si on a déjà une devise en cache
  const cachedCurrency = localStorage.getItem('geniuslab_currency');
  const cacheTimestamp = localStorage.getItem('geniuslab_currency_timestamp');
  
  // Cache valide pour 7 jours
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  if (cachedCurrency && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
    console.log(`[GeniusLab Pricing] Utilisation du cache: ${cachedCurrency}`);
    return cachedCurrency;
  }
  
  try {
    console.log('[GeniusLab Pricing] Détection de la localisation...');
    
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    const countryCode = data.country_code;
    
    console.log(`[GeniusLab Pricing] Pays détecté: ${countryCode}`);
    
    const currency = getCurrencyForCountry(countryCode);
    
    // Sauvegarder en cache
    localStorage.setItem('geniuslab_currency', currency);
    localStorage.setItem('geniuslab_currency_timestamp', now.toString());
    
    return currency;
    
  } catch (error) {
    console.warn('[GeniusLab Pricing] Erreur détection localisation:', error);
    console.log('[GeniusLab Pricing] Utilisation de CHF par défaut');
    return 'CHF'; // Fallback
  }
}

/**
 * Initialise le système de pricing
 */
async function initPricing() {
  console.log('[GeniusLab Pricing] Initialisation...');
  
  // Détecter la devise appropriée
  const currency = await detectUserLocation();
  
  // Mettre à jour tous les prix
  updateAllPrices(currency);
  
  console.log('[GeniusLab Pricing] Système initialisé avec succès');
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPricing);
} else {
  initPricing();
}
