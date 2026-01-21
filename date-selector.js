/**
 * GeniusLab - Date Selector for Training Sessions
 * Automatically generates future dates for Saturday mornings (in-person) and Wednesday evenings (Google Meet)
 * Automatically grays out past dates
 */

const DATE_SELECTOR_CONFIG = {
    weeksToGenerate: 8, // Generate dates for next 8 weeks
    inPerson: {
        dayOfWeek: 6, // Saturday
        time: '9h-13h',
        type: 'Présentiel'
    },
    online: {
        dayOfWeek: 3, // Wednesday
        time: '18h-22h',
        type: 'Google Meet'
    }
};

/**
 * Get the next occurrence of a specific day of the week
 */
function getNextDayOfWeek(dayOfWeek, weeksFromNow = 0) {
    const today = new Date();
    const currentDay = today.getDay();

    let daysToAdd = dayOfWeek - currentDay;

    // If the target day has already passed this week, move to next week
    if (daysToAdd <= 0) {
        daysToAdd += 7;
    }

    // Add additional weeks if needed
    daysToAdd += (weeksFromNow * 7);

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    targetDate.setHours(0, 0, 0, 0); // Reset time to midnight

    return targetDate;
}

/**
 * Check if a date is in the past
 */
function isDatePast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

/**
 * Format date to French locale
 */
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

/**
 * Format date to ISO string for storage
 */
function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Generate all available training dates
 */
function generateTrainingDates() {
    const dates = [];

    for (let week = 0; week < DATE_SELECTOR_CONFIG.weeksToGenerate; week++) {
        // Add Saturday (in-person)
        const saturday = getNextDayOfWeek(DATE_SELECTOR_CONFIG.inPerson.dayOfWeek, week);
        dates.push({
            date: saturday,
            dateISO: formatDateISO(saturday),
            dateFormatted: formatDate(saturday),
            time: DATE_SELECTOR_CONFIG.inPerson.time,
            type: DATE_SELECTOR_CONFIG.inPerson.type,
            isPast: isDatePast(saturday),
            icon: '📍'
        });

        // Add Wednesday (online)
        const wednesday = getNextDayOfWeek(DATE_SELECTOR_CONFIG.online.dayOfWeek, week);
        dates.push({
            date: wednesday,
            dateISO: formatDateISO(wednesday),
            dateFormatted: formatDate(wednesday),
            time: DATE_SELECTOR_CONFIG.online.time,
            type: DATE_SELECTOR_CONFIG.online.type,
            isPast: isDatePast(wednesday),
            icon: '💻'
        });
    }

    // Sort by date
    dates.sort((a, b) => a.date - b.date);

    // Filter out past dates
    return dates.filter(d => !d.isPast);
}

/**
 * Render date selection cards
 */
function renderDateSelector() {
    const container = document.getElementById('date-selector-container');
    if (!container) {
        console.warn('[Date Selector] Container not found');
        return;
    }

    const dates = generateTrainingDates();

    if (dates.length === 0) {
        container.innerHTML = '<p class="no-dates">Aucune date disponible pour le moment. Veuillez nous contacter.</p>';
        return;
    }

    let html = '<div class="date-cards-grid">';

    dates.forEach((dateInfo, index) => {
        const cardClass = dateInfo.isPast ? 'date-card disabled' : 'date-card';
        const dateId = `date-${dateInfo.dateISO}`;

        html += `
      <div class="${cardClass}" data-date-id="${dateId}">
        <input 
          type="radio" 
          id="${dateId}" 
          name="training-date" 
          value="${dateInfo.dateISO}"
          data-type="${dateInfo.type}"
          data-time="${dateInfo.time}"
          ${dateInfo.isPast ? 'disabled' : ''}
        />
        <label for="${dateId}">
          <div class="date-card-header">
            <span class="date-icon">${dateInfo.icon}</span>
            <span class="date-type">${dateInfo.type}</span>
          </div>
          <div class="date-card-date">${dateInfo.dateFormatted}</div>
          <div class="date-card-time">${dateInfo.time}</div>
        </label>
      </div>
    `;
    });

    html += '</div>';

    container.innerHTML = html;

    // Add event listeners for date selection
    setupDateSelectionListeners();
}

/**
 * Setup event listeners for date selection
 */
function setupDateSelectionListeners() {
    const radioButtons = document.querySelectorAll('input[name="training-date"]');
    const continueBtn = document.getElementById('continue-to-payment-btn');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            // Update selected state visually
            document.querySelectorAll('.date-card').forEach(card => {
                card.classList.remove('selected');
            });

            if (this.checked) {
                this.closest('.date-card').classList.add('selected');

                // Enable continue button
                if (continueBtn) {
                    continueBtn.disabled = false;
                }

                // Store selected date in localStorage
                const selectedDate = {
                    date: this.value,
                    type: this.dataset.type,
                    time: this.dataset.time
                };
                localStorage.setItem('geniuslab_selected_date', JSON.stringify(selectedDate));

                console.log('[Date Selector] Date selected:', selectedDate);
            }
        });
    });

    // Setup continue button
    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            const selectedDate = localStorage.getItem('geniuslab_selected_date');

            if (!selectedDate) {
                alert('Veuillez sélectionner une date de formation.');
                return;
            }

            // Redirect to payment page (or show payment section)
            console.log('[Date Selector] Proceeding to payment with date:', selectedDate);

            // You can customize this based on your payment flow
            window.location.href = 'paiement.html';
        });
    }
}

/**
 * Initialize the date selector
 */
function initDateSelector() {
    console.log('[Date Selector] Initializing...');
    renderDateSelector();
    console.log('[Date Selector] Initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDateSelector);
} else {
    initDateSelector();
}
