/**
 * ParkShare AI - Core Application Logic
 * Comprehensive 20-Feature Smart Parking Marketplace with AI Demand Prediction,
 * Dynamic Pricing, Weather-Aware Surge, Computer Vision Space Verification,
 * Overstay Alerts, Vehicle-Based Pricing, and Famous Location Access.
 */

// Famous Landmarks Database for Instant Access
const FAMOUS_LANDMARKS = [
  { id: 'chinnaswamy', name: '🏏 Chinnaswamy Stadium', locality: 'mgroad', query: 'chinnaswamy', coords: { x: 30, y: 32 }, tag: 'Cricket Match Zone', demandLevel: 'high' },
  { id: 'indiranagar100', name: '🍸 Indiranagar 100ft Rd', locality: 'indiranagar', query: 'indiranagar', coords: { x: 40, y: 46 }, tag: 'Nightlife & Pubs', demandLevel: 'high' },
  { id: 'koramangala5', name: '☕ Koramangala 5th Block', locality: 'koramangala', query: 'koramangala', coords: { x: 48, y: 72 }, tag: 'Cafes & Startups', demandLevel: 'high' },
  { id: 'churchstreet', name: '🛍️ Church Street / MG Rd', locality: 'mgroad', query: 'church street', coords: { x: 26, y: 36 }, tag: 'CBD & Metro Central', demandLevel: 'high' },
  { id: 'whitefielditpl', name: '🏢 Whitefield ITPL', locality: 'whitefield', query: 'whitefield', coords: { x: 78, y: 34 }, tag: 'IT Tech Parks', demandLevel: 'medium' },
  { id: 'phoenixmarketcity', name: '🏬 Phoenix Marketcity', locality: 'whitefield', query: 'phoenix', coords: { x: 72, y: 48 }, tag: 'Mall & Weekend Rush', demandLevel: 'high' },
  { id: 'hsrsector1', name: '🌳 HSR Layout Sector 1/2', locality: 'hsr', query: 'hsr', coords: { x: 62, y: 82 }, tag: 'Residential & Cafes', demandLevel: 'low' },
  { id: 'majestic', name: '🚇 Majestic City Central', locality: 'mgroad', query: 'majestic', coords: { x: 18, y: 28 }, tag: 'Railway & Transit', demandLevel: 'high' }
];

// Rich Seed Data with 20 Smart Parking Attributes
const INITIAL_SPOTS = [
  {
    id: 'spot-1',
    title: "Brigade Tech Park — After-Hours Lot",
    type: 'office',
    typeLabel: '🏢 Office Parking',
    typeTagClass: 'tag-office',
    location: "Whitefield Main Road, Near ITPL",
    locality: "whitefield",
    landmarkNear: "whitefielditpl",
    host: "Brigade Facility Mgmt",
    rating: 4.9,
    reviewsCount: 142,
    basePrice: 30,
    demandLevel: 'high',
    demandMultiplier: 1.5,
    surgeReason: "Tech Park Peak & Mall Spillover",
    features: ["⚡ EV Fast Charger", "📹 24/7 CCTV", "🛡️ Boom Barrier OTP", "☂️ Basement Covered"],
    availability: "Daily: 6:00 PM – 8:00 AM & Weekends All Day",
    distance: "120m away",
    distanceMeters: 120,
    walkingTime: "2 min walk",
    walkScore: 96,
    ecoScore: "Saves 1.6kg CO2 (A+)",
    isCovered: true,
    groupParkingCapable: true,
    fakeRiskScore: "0.4% (VERIFIED GREEN)",
    mapCoords: { x: 74, y: 32 },
    spotsAvailable: 18,
    occupancyRate: 88,
    description: "Corporate basement parking slot available every weekday evening after corporate hours and full weekends. Automated ANPR and QR gate."
  },
  {
    id: 'spot-2',
    title: "Sharma Villa — Gated Driveway",
    type: 'home',
    typeLabel: '🏠 Home Driveway',
    typeTagClass: 'tag-home',
    location: "12th Main, Indiranagar (Near Toit)",
    locality: "indiranagar",
    landmarkNear: "indiranagar100",
    host: "Col. R. Sharma (Retd.)",
    rating: 5.0,
    reviewsCount: 89,
    basePrice: 30,
    demandLevel: 'high',
    demandMultiplier: 1.5,
    surgeReason: "100ft Road Pub & Dining Rush",
    features: ["🔒 Private Gated", "☂️ Roof Shed", "📹 Ring Camera", "🚗 Wide SUV Fit"],
    availability: "Mon–Sun: 10:00 AM – 11:30 PM",
    distance: "80m from 100ft Road",
    distanceMeters: 80,
    walkingTime: "1 min walk",
    walkScore: 98,
    ecoScore: "Saves 1.9kg CO2 (A+)",
    isCovered: true,
    groupParkingCapable: false,
    fakeRiskScore: "0.2% (VERIFIED GREEN)",
    mapCoords: { x: 38, y: 45 },
    spotsAvailable: 2,
    occupancyRate: 94,
    description: "Private residential covered car port in a quiet cul-de-sac, 1 minute away from Toit and 100ft Road dining strip. Zero congestion entry."
  },
  {
    id: 'spot-3',
    title: "Crossword & Cafe Overnight Space",
    type: 'shop',
    typeLabel: '🏬 Retail Shop',
    typeTagClass: 'tag-shop',
    location: "80ft Road, Koramangala 4th Block",
    locality: "koramangala",
    landmarkNear: "koramangala5",
    host: "Crossword Books Hub",
    rating: 4.8,
    reviewsCount: 64,
    basePrice: 30,
    demandLevel: 'medium',
    demandMultiplier: 1.15,
    surgeReason: "Nightlife & Cafe Transit",
    features: ["💡 Well Lit", "🛡️ Night Watchman", "⚡ EV 15A Plug"],
    availability: "Daily: 8:00 PM – 9:00 AM",
    distance: "250m away",
    distanceMeters: 250,
    walkingTime: "3 min walk",
    walkScore: 89,
    ecoScore: "Saves 1.1kg CO2 (A)",
    isCovered: false,
    groupParkingCapable: true,
    fakeRiskScore: "0.9% (VERIFIED GREEN)",
    mapCoords: { x: 48, y: 70 },
    spotsAvailable: 6,
    occupancyRate: 65,
    description: "Commercial shopfront parking space unlocked for verified ParkShare drivers after closing hours. Guarded by overnight security personnel."
  },
  {
    id: 'spot-4',
    title: "Prestige Meridian Stilt Carport",
    type: 'home',
    typeLabel: '🏠 Apartment Stilt',
    typeTagClass: 'tag-home',
    location: "MG Road CBD, Near Metro Station",
    locality: "mgroad",
    landmarkNear: "churchstreet",
    host: "Ananya Deshmukh",
    rating: 4.9,
    reviewsCount: 112,
    basePrice: 30,
    demandLevel: 'high',
    demandMultiplier: 1.55,
    surgeReason: "Metro CBD Friday Congestion",
    features: ["🚆 50m to Metro", "☂️ Covered Basement", "📹 CCTV", "♿ Elevator Access"],
    availability: "Flexible: 8:00 AM – 10:00 PM",
    distance: "50m to MG Road Metro",
    distanceMeters: 50,
    walkingTime: "1 min walk",
    walkScore: 99,
    ecoScore: "Saves 2.3kg CO2 (A+)",
    isCovered: true,
    groupParkingCapable: false,
    fakeRiskScore: "0.5% (VERIFIED GREEN)",
    mapCoords: { x: 26, y: 36 },
    spotsAvailable: 1,
    occupancyRate: 92,
    description: "Prime CBD apartment stilt parking. Ideal for metro commuters, business meetings on MG Road, or shopping on Brigade Road."
  },
  {
    id: 'spot-5',
    title: "Chinnaswamy Match-Day Private Bay",
    type: 'home',
    typeLabel: '🏠 Stadium Gated Spot',
    typeTagClass: 'tag-home',
    location: "Queens Road, Opp. Chinnaswamy Gate 3",
    locality: "mgroad",
    landmarkNear: "chinnaswamy",
    host: "Dr. K. Venkatesh",
    rating: 5.0,
    reviewsCount: 96,
    basePrice: 35,
    demandLevel: 'high',
    demandMultiplier: 1.6,
    surgeReason: "IPL Cricket Match High Surge",
    features: ["🏏 Stadium Gate 3 Walk", "🛡️ Guarded Gate", "☂️ Canopy Covered", "🚗 Easy Exit"],
    availability: "Event Days & Daily 12:00 PM – 11:00 PM",
    distance: "90m from Stadium Gate 3",
    distanceMeters: 90,
    walkingTime: "1 min walk",
    walkScore: 99,
    ecoScore: "Saves 2.5kg CO2 (A+)",
    isCovered: true,
    groupParkingCapable: true,
    fakeRiskScore: "0.1% (VERIFIED GREEN)",
    mapCoords: { x: 30, y: 32 },
    spotsAvailable: 3,
    occupancyRate: 96,
    description: "Gated private compound directly opposite Chinnaswamy Stadium Gate 3. Avoid traffic blocks with private rear alley exit."
  },
  {
    id: 'spot-6',
    title: "Sector 2 Community Open Plot",
    type: 'home',
    typeLabel: '🏠 Secured Plot',
    typeTagClass: 'tag-home',
    location: "14th Main, HSR Layout Sector 2",
    locality: "hsr",
    landmarkNear: "hsrsector1",
    host: "Vikramaditya S.",
    rating: 4.7,
    reviewsCount: 38,
    basePrice: 30,
    demandLevel: 'low',
    demandMultiplier: 0.75,
    surgeReason: "Off-Peak Residential Morning",
    features: ["🚙 Large SUVs/Van", "🔒 Padlock Code", "📹 Perimeter Camera"],
    availability: "24/7 Round the Clock",
    distance: "400m away",
    distanceMeters: 400,
    walkingTime: "5 min walk",
    walkScore: 78,
    ecoScore: "Saves 0.8kg CO2 (B)",
    isCovered: false,
    groupParkingCapable: true,
    fakeRiskScore: "0.7% (VERIFIED GREEN)",
    mapCoords: { x: 62, y: 82 },
    spotsAvailable: 4,
    occupancyRate: 35,
    description: "Fenced private compound in HSR Layout Sector 2. Extra wide space, very easy in-and-out maneuvering with digital gate code."
  },
  {
    id: 'spot-7',
    title: "Phoenix Marketcity Spillover Carport",
    type: 'shop',
    typeLabel: '🏬 Commercial Lot',
    typeTagClass: 'tag-shop',
    location: "Mahadevapura, 150m from Phoenix Mall",
    locality: "whitefield",
    landmarkNear: "phoenixmarketcity",
    host: "Nexus Plaza Admin",
    rating: 4.8,
    reviewsCount: 88,
    basePrice: 30,
    demandLevel: 'high',
    demandMultiplier: 1.45,
    surgeReason: "Weekend Mall Queue Bypass",
    features: ["🛍️ Skip Mall Line", "📹 24/7 CCTV", "🛡️ Boom Barrier", "⚡ EV Charger"],
    availability: "Daily: 10:00 AM – 11:00 PM",
    distance: "150m from Phoenix Mall",
    distanceMeters: 150,
    walkingTime: "2 min walk",
    walkScore: 94,
    ecoScore: "Saves 1.8kg CO2 (A+)",
    isCovered: true,
    groupParkingCapable: true,
    fakeRiskScore: "0.3% (VERIFIED GREEN)",
    mapCoords: { x: 72, y: 48 },
    spotsAvailable: 10,
    occupancyRate: 85,
    description: "Skip the 45-minute Phoenix Mall basement ramp queue. Park in this VIP verified spillover slot 2 mins walk from entrance."
  },
  {
    id: 'spot-8',
    title: "Urban Ladder HQ Visitor Bay",
    type: 'office',
    typeLabel: '🏢 Corporate Bay',
    typeTagClass: 'tag-office',
    location: "Outer Ring Road, Bellandur",
    locality: "whitefield",
    landmarkNear: "whitefielditpl",
    host: "Facility Admin ORR",
    rating: 4.8,
    reviewsCount: 79,
    basePrice: 30,
    demandLevel: 'medium',
    demandMultiplier: 1.2,
    surgeReason: "ORR IT Corridor Traffic",
    features: ["⚡ EV Fast Charger", "🛡️ Professional Security", "☂️ Multilevel Covered"],
    availability: "Weekdays 6:00 PM – 7:00 AM, Weekends 24 hrs",
    distance: "300m from Ecospace",
    distanceMeters: 300,
    walkingTime: "4 min walk",
    walkScore: 86,
    ecoScore: "Saves 1.3kg CO2 (A)",
    isCovered: true,
    groupParkingCapable: true,
    fakeRiskScore: "0.4% (VERIFIED GREEN)",
    mapCoords: { x: 82, y: 64 },
    spotsAvailable: 12,
    occupancyRate: 72,
    description: "Premium tech park multi-level visitor parking unlocked for public night sharing. Equipped with DC fast chargers and 24x7 security."
  }
];

// App State Management
const AppState = {
  currentTab: 'driver',
  spots: [...INITIAL_SPOTS],
  selectedSpot: null,
  activeFilter: 'all',
  selectedLocality: 'all',
  selectedLandmark: null,
  searchQuery: '',
  walletBalance: 1450,
  
  // 20-Feature Parameters
  vehicleType: 'car', // 'bike' (0.5x), 'car' (1.0x), 'suv' (1.4x)
  weatherCondition: 'sunny', // 'sunny' (1.0x), 'rain' (1.35x covered), 'storm' (1.5x covered)
  personalizationMode: 'ai_best', // 'ai_best', 'cheapest', 'closest', 'safest', 'eco'
  hotspotOverlayActive: true,
  groupParkingCount: 1,

  // Active Session & Overstay Alert
  activeSession: {
    active: true,
    spotName: "Sharma Villa (Indiranagar)",
    slotNumber: "A-2",
    totalSecondsRemaining: 868, // 14 mins 28 secs
    timerInterval: null
  },

  // Future Parking Predictor
  futurePrediction: {
    targetDay: "Friday",
    targetHour: 19,
    location: "indiranagar"
  },

  // AI Pricing Simulator State
  simulator: {
    dayOfWeek: 5, // Friday
    timeOfDay: 19, // 7 PM
    localityType: 'entertainment',
    eventMultiplier: 1.3,
    localOccupancy: 88,
    basePrice: 30
  },

  // Diagrams Walkthrough State
  diagramTab: 'pfd',
  pfdStep: 0,
  tfdSelectedNode: 'api-gateway',

  // Pitch Deck Slide State
  currentSlide: 0,
  totalSlides: 10
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupDriverMarketplace();
  setupFamousLocations();
  setupVehiclePricing();
  setupWeatherPricing();
  setupPersonalization();
  setupActiveSessionTimer();
  setupHostStudio();
  setupSimulator();
  setupDiagrams();
  setupPitchDeck();
  setupModalDismissals();
  renderSpots();
  renderMapRadar();
  updateSimulatorResults();
});

// Toast Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚡' : type === 'error' ? '🚨' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------
// Navigation Tab Switching
// ----------------------------------------------------
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const citySelect = document.getElementById('city-selector');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      showToast(`Switched active metro area to ${e.target.value}. Updating localized demand indexes...`, 'info');
      renderSpots();
      renderMapRadar();
    });
  }
}

function switchTab(tabId) {
  AppState.currentTab = tabId;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  if (tabId === 'simulator') {
    updateSimulatorResults();
  }
}

// ----------------------------------------------------
// 1. Famous Locations & Custom Location Access
// ----------------------------------------------------
function setupFamousLocations() {
  const chipsContainer = document.getElementById('famous-chips-container');
  if (!chipsContainer) return;

  chipsContainer.innerHTML = FAMOUS_LANDMARKS.map(landmark => `
    <button class="famous-chip ${AppState.selectedLandmark === landmark.id ? 'active' : ''}" 
            data-landmark-id="${landmark.id}"
            onclick="selectFamousLandmark('${landmark.id}')">
      <span>${landmark.name}</span>
    </button>
  `).join('');
}

function selectFamousLandmark(landmarkId) {
  const landmark = FAMOUS_LANDMARKS.find(l => l.id === landmarkId);
  if (!landmark) return;

  AppState.selectedLandmark = landmarkId;
  AppState.searchQuery = landmark.query;
  AppState.selectedLocality = landmark.locality;

  // Update search input and locality dropdown
  const searchInput = document.getElementById('driver-search-input');
  if (searchInput) searchInput.value = landmark.name.replace(/[^a-zA-Z0-9 ]/g, '').trim();

  const localitySelect = document.getElementById('driver-locality-select');
  if (localitySelect) localitySelect.value = landmark.locality;

  // Highlight chip
  document.querySelectorAll('.famous-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-landmark-id') === landmarkId);
  });

  showToast(`🎯 Centered on ${landmark.name} • Filtered nearby verified spots within 300m!`, 'success');
  renderSpots();
  renderMapRadar();

  // Highlight first matched spot if available
  const matched = AppState.spots.find(s => s.locality === landmark.locality || s.landmarkNear === landmarkId);
  if (matched) {
    selectSpot(matched.id);
  }
}

// ----------------------------------------------------
// 2. Vehicle-Based Pricing (Bike / Car / SUV)
// ----------------------------------------------------
function setupVehiclePricing() {
  const vehicleButtons = document.querySelectorAll('.vehicle-btn');
  vehicleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      vehicleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.vehicleType = btn.getAttribute('data-vehicle');
      
      const multiplierText = AppState.vehicleType === 'bike' ? '0.5x (50% Off)' : AppState.vehicleType === 'suv' ? '1.4x (Heavy Bay)' : '1.0x (Standard)';
      showToast(`🚗 Vehicle switched to ${AppState.vehicleType.toUpperCase()} (${multiplierText}). Updated all parking rates!`, 'info');
      
      renderSpots();
      renderMapRadar();
      if (AppState.selectedSpot) {
        updateBookingBreakdown(AppState.selectedSpot, bookingDuration);
      }
    });
  });
}

function getVehicleMultiplier() {
  if (AppState.vehicleType === 'bike') return 0.5;
  if (AppState.vehicleType === 'suv') return 1.4;
  return 1.0; // standard car
}

// ----------------------------------------------------
// 3. Weather-Aware Dynamic Pricing (Rain / Storm / Sunny)
// ----------------------------------------------------
function setupWeatherPricing() {
  const weatherBadges = document.querySelectorAll('.weather-badge');
  weatherBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      weatherBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      AppState.weatherCondition = badge.getAttribute('data-weather');

      if (AppState.weatherCondition === 'rain') {
        showToast("🌧️ Monsoon Alert: Demand for covered/basement spots surged +35%! Open spots discounted.", "warning");
      } else if (AppState.weatherCondition === 'storm') {
        showToast("⛈️ Severe Thunderstorm: Covered spaces in extreme demand (+50% surge) to prevent hailstorm damage.", "warning");
      } else {
        showToast("☀️ Weather Normal: Standard fair pricing active.", "info");
      }

      renderSpots();
      renderMapRadar();
    });
  });
}

function getWeatherMultiplier(isCovered) {
  if (AppState.weatherCondition === 'rain') {
    return isCovered ? 1.35 : 0.85; // covered surges, open discounts
  }
  if (AppState.weatherCondition === 'storm') {
    return isCovered ? 1.50 : 0.75;
  }
  return 1.0;
}

// ----------------------------------------------------
// 4. Personalized Ranking & Sorting
// ----------------------------------------------------
function setupPersonalization() {
  const select = document.getElementById('personalization-select');
  if (select) {
    select.addEventListener('change', (e) => {
      AppState.personalizationMode = e.target.value;
      showToast(`🎯 Personalization updated: Ranked by ${e.target.options[e.target.selectedIndex].text}`, 'info');
      renderSpots();
    });
  }
}

function sortSpotsByPersonalization(spots) {
  const vMulti = getVehicleMultiplier();

  return [...spots].sort((a, b) => {
    const priceA = Math.round(a.basePrice * a.demandMultiplier * vMulti * getWeatherMultiplier(a.isCovered));
    const priceB = Math.round(b.basePrice * b.demandMultiplier * vMulti * getWeatherMultiplier(b.isCovered));

    if (AppState.personalizationMode === 'cheapest') {
      return priceA - priceB;
    }
    if (AppState.personalizationMode === 'closest') {
      return a.distanceMeters - b.distanceMeters;
    }
    if (AppState.personalizationMode === 'safest') {
      const securityScoreA = (a.features.some(f => f.includes('CCTV')) ? 2 : 0) + (a.features.some(f => f.includes('Guard') || f.includes('Barrier')) ? 2 : 0) + a.rating;
      const securityScoreB = (b.features.some(f => f.includes('CCTV')) ? 2 : 0) + (b.features.some(f => f.includes('Guard') || f.includes('Barrier')) ? 2 : 0) + b.rating;
      return securityScoreB - securityScoreA;
    }
    if (AppState.personalizationMode === 'eco') {
      return b.walkScore - a.walkScore;
    }
    // Default: 'ai_best' (Pareto Optimal Multi-Objective Score)
    const scoreA = (100 - (a.distanceMeters / 6)) * 0.4 + (100 - priceA * 1.5) * 0.35 + (a.rating * 20) * 0.25;
    const scoreB = (100 - (b.distanceMeters / 6)) * 0.4 + (100 - priceB * 1.5) * 0.35 + (b.rating * 20) * 0.25;
    return scoreB - scoreA;
  });
}

// ----------------------------------------------------
// 5. Active Session Timer & Overstay Alert (Feature 17)
// ----------------------------------------------------
function setupActiveSessionTimer() {
  const countdownElem = document.getElementById('session-countdown');
  if (!countdownElem) return;

  if (AppState.activeSession.timerInterval) {
    clearInterval(AppState.activeSession.timerInterval);
  }

  AppState.activeSession.timerInterval = setInterval(() => {
    if (AppState.activeSession.totalSecondsRemaining > 0) {
      AppState.activeSession.totalSecondsRemaining--;
      const mins = Math.floor(AppState.activeSession.totalSecondsRemaining / 60);
      const secs = AppState.activeSession.totalSecondsRemaining % 60;
      countdownElem.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} remaining`;

      // Trigger Alert when under 15 minutes
      if (AppState.activeSession.totalSecondsRemaining === 900) {
        showToast("🚨 Overstay Warning: 15 minutes remaining on your booking! Extend now to prevent surcharge.", "error");
      }
    } else {
      countdownElem.textContent = "EXPIRED (OVERSTAY)";
      countdownElem.style.color = "#f43f5e";
    }
  }, 1000);
}

function extendParkingSession() {
  AppState.activeSession.totalSecondsRemaining += 3600; // +1 hour
  showToast("⏱️ Session Extended by +1 Hour! ₹40 deducted from wallet. Overstay penalty averted.", "success");
  const banner = document.getElementById('active-session-banner');
  if (banner) {
    banner.style.borderColor = "#10b981";
    setTimeout(() => banner.style.borderColor = "", 3000);
  }
}

// ----------------------------------------------------
// 6. Future Parking Prediction Oracle (Feature 11)
// ----------------------------------------------------
function predictFutureParking() {
  const day = document.getElementById('oracle-day-select')?.value || 'Friday';
  const hour = parseInt(document.getElementById('oracle-hour-select')?.value || '19');
  const loc = document.getElementById('oracle-locality-select')?.value || 'indiranagar';

  let demandText = "HIGH DEMAND (92%)";
  let suggestedRate = 45;
  let tip = "Heavy Friday evening dining rush projected. Pre-book now to lock base ₹30 rate!";

  if (hour < 8) {
    demandText = "LOW DEMAND (22%)";
    suggestedRate = 20;
    tip = "Early off-peak window. Plenty of empty driveway slots available.";
  } else if (day === 'Sunday' && loc === 'whitefield') {
    demandText = "LOW DEMAND (30%)";
    suggestedRate = 22;
    tip = "Office tech parks completely vacant. Great value parking.";
  } else if (loc === 'chinnaswamy' || (day === 'Friday' && hour >= 18)) {
    demandText = "EXTREME SURGE DEMAND (96%)";
    suggestedRate = 50;
    tip = "Stadium event & weekend traffic collision. Reserve ASAP to guarantee slot.";
  }

  const resultContainer = document.getElementById('oracle-prediction-display');
  if (resultContainer) {
    resultContainer.innerHTML = `
      <div>
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">
          Forecast for ${day} at ${hour.toString().padStart(2, '0')}:00
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0.2rem 0;">
          ${demandText} • Est. Rate: <span style="color: var(--accent-emerald-light);">₹${suggestedRate}/hr</span>
        </div>
        <div style="font-size: 0.8rem; color: #cbd5e1;">💡 ${tip}</div>
      </div>
      <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="switchTab('driver'); showToast('Pre-booking discount locked in!', 'success')">
        Lock Rate Early ⚡
      </button>
    `;
  }
}

// ----------------------------------------------------
// 7. Computer Vision AI Photo Verification (Feature 15)
// ----------------------------------------------------
function runAiPhotoScan() {
  const laser = document.getElementById('cv-scan-laser');
  const statusElem = document.getElementById('cv-scan-status');
  const scoreElem = document.getElementById('cv-score-val');
  
  if (laser) laser.classList.add('scanning');
  if (statusElem) statusElem.textContent = "AI Scanning Space: Analyzing geometry, obstructions & gate clearance...";

  setTimeout(() => {
    if (laser) laser.classList.remove('scanning');
    if (statusElem) statusElem.innerHTML = "<span style='color: var(--accent-emerald-light); font-weight: 700;'>✅ Verification Complete: Space Approved for Listing!</span>";
    if (scoreElem) scoreElem.textContent = "98% (READY TO LIST)";
    
    document.querySelectorAll('.cv-metric-box').forEach(box => box.classList.add('pass'));
    showToast("📸 Computer Vision: Photo passed 4-point safety and dimension verification!", "success");
  }, 2200);
}

// ----------------------------------------------------
// Tab 1: Driver Marketplace & Interactive Radar Map
// ----------------------------------------------------
function setupDriverMarketplace() {
  // Filter chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeFilter = chip.getAttribute('data-filter');
      renderSpots();
    });
  });

  // Search input & locality filter
  const searchInput = document.getElementById('driver-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.toLowerCase();
      renderSpots();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        showToast(`Searching nearby parking spots for "${searchInput.value}"...`, 'info');
        renderSpots();
        renderMapRadar();
      }
    });
  }

  const localitySelect = document.getElementById('driver-locality-select');
  if (localitySelect) {
    localitySelect.addEventListener('change', (e) => {
      AppState.selectedLocality = e.target.value;
      renderSpots();
      renderMapRadar();
    });
  }

  // Quick search button
  const searchBtn = document.getElementById('btn-find-parking');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      showToast("AI Engine re-computed live slot availability & surge rates!", "success");
      renderSpots();
      renderMapRadar();
    });
  }
}

function renderSpots() {
  const grid = document.getElementById('spots-grid');
  if (!grid) return;

  const vMulti = getVehicleMultiplier();

  let filtered = AppState.spots.filter(spot => {
    // Locality filter
    if (AppState.selectedLocality !== 'all' && spot.locality !== AppState.selectedLocality) {
      return false;
    }
    // Search query
    if (AppState.searchQuery && !spot.title.toLowerCase().includes(AppState.searchQuery) && !spot.location.toLowerCase().includes(AppState.searchQuery)) {
      return false;
    }
    // Quick filter chips
    if (AppState.activeFilter === 'home' && spot.type !== 'home') return false;
    if (AppState.activeFilter === 'office' && spot.type !== 'office') return false;
    if (AppState.activeFilter === 'shop' && spot.type !== 'shop') return false;
    if (AppState.activeFilter === 'ev' && !spot.features.some(f => f.includes('EV'))) return false;
    if (AppState.activeFilter === 'covered' && !spot.isCovered) return false;
    if (AppState.activeFilter === 'group' && !spot.groupParkingCapable) return false;
    return true;
  });

  // Sort by Personalization
  filtered = sortSpotsByPersonalization(filtered);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 3rem 1rem;">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🔍</span>
        <h3>No spots found matching your filter</h3>
        <p style="color: var(--text-secondary); margin-top: 0.5rem;">Try choosing "All Bangalore" or picking one of the famous landmarks above.</p>
        <button class="btn-primary" style="margin: 1rem auto 0 auto;" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((spot, index) => {
    // Weather & Vehicle aware dynamic price
    const weatherFactor = getWeatherMultiplier(spot.isCovered);
    const dynamicPrice = Math.max(15, Math.round(spot.basePrice * spot.demandMultiplier * vMulti * weatherFactor));
    const baseVehiclePrice = Math.round(spot.basePrice * vMulti);
    const isSurged = dynamicPrice > baseVehiclePrice;

    const demandBadgeClass = spot.demandLevel === 'high' ? 'demand-high' : spot.demandLevel === 'medium' ? 'demand-medium' : 'demand-low';
    const demandIcon = spot.demandLevel === 'high' ? '🔥 HIGH DEMAND' : spot.demandLevel === 'medium' ? '⚡ NORMAL DEMAND' : '🟢 OFF-PEAK';

    // AI Top Recommendation Pick for the first item
    const isAiPick = index === 0;

    return `
      <div class="spot-card ${AppState.selectedSpot?.id === spot.id ? 'selected' : ''}" 
           id="card-${spot.id}"
           onclick="selectSpot('${spot.id}')">
        ${isAiPick ? `<div class="ai-pick-ribbon">🏆 AI #1 PICK: BEST VALUE & WALK</div>` : ''}

        <div class="spot-top" style="${isAiPick ? 'margin-top: 0.5rem;' : ''}">
          <div>
            <span class="spot-type-tag ${spot.typeTagClass}">${spot.typeLabel}</span>
            <h3 class="spot-title">${spot.title}</h3>
            <div class="spot-location">
              <span>📍 ${spot.location}</span>
            </div>
          </div>
          <div class="spot-pricing">
            <div class="price-val">
              ${isSurged ? `<span class="base-strikethrough">₹${baseVehiclePrice}</span>` : ''}₹${dynamicPrice}<span>/hr</span>
            </div>
            <div class="demand-badge ${demandBadgeClass}">${demandIcon}</div>
          </div>
        </div>

        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">${spot.description}</p>

        <!-- 20-Feature Smart Metrics: Walk Score, Eco Score & Vehicle Pill -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin: 0.2rem 0;">
          <span class="walk-score-pill" title="Park & Walk Score">🅿️ Walk Score: ${spot.walkScore}/100 (${spot.distance})</span>
          <span class="eco-score-pill" title="Eco Parking Score">🌱 ${spot.ecoScore}</span>
          ${spot.groupParkingCapable ? `<span class="feature-badge-tag" style="background: rgba(139, 92, 246, 0.15); color: #c084fc; border-color: rgba(139, 92, 246, 0.3);">🧑🤝🧑 Group Ready</span>` : ''}
          ${spot.isCovered ? `<span class="feature-badge-tag">☂️ Rain Protected</span>` : ''}
        </div>

        <div class="spot-features">
          ${spot.features.map(feat => `<span class="feature-pill">${feat}</span>`).join('')}
        </div>

        <div class="spot-footer">
          <div class="host-info">
            <div class="host-avatar">${spot.type === 'home' ? '🏠' : spot.type === 'office' ? '🏢' : '🏬'}</div>
            <div>
              <strong style="color: #fff; font-size: 0.82rem;">${spot.host}</strong>
              <span style="color: var(--accent-amber); margin-left: 0.35rem;">★ ${spot.rating} (${spot.reviewsCount})</span>
              <span style="color: var(--accent-emerald-light); font-size: 0.72rem; margin-left: 0.35rem;">🛡️ ${spot.fakeRiskScore}</span>
            </div>
          </div>
          <button class="btn-book-sm" onclick="event.stopPropagation(); openBookingModal('${spot.id}')">
            Reserve Slot ⚡
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function resetFilters() {
  AppState.activeFilter = 'all';
  AppState.selectedLocality = 'all';
  AppState.selectedLandmark = null;
  AppState.searchQuery = '';
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.filter-chip[data-filter="all"]')?.classList.add('active');
  document.querySelectorAll('.famous-chip').forEach(c => c.classList.remove('active'));
  const localitySelect = document.getElementById('driver-locality-select');
  if (localitySelect) localitySelect.value = 'all';
  const searchInput = document.getElementById('driver-search-input');
  if (searchInput) searchInput.value = '';
  renderSpots();
  renderMapRadar();
}

function selectSpot(spotId) {
  const spot = AppState.spots.find(s => s.id === spotId);
  if (!spot) return;
  AppState.selectedSpot = spot;

  // Highlight spot card
  document.querySelectorAll('.spot-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`card-${spotId}`);
  if (card) {
    card.classList.add('selected');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Highlight map pin
  document.querySelectorAll('.map-pin').forEach(pin => pin.classList.remove('active'));
  const pin = document.getElementById(`pin-${spotId}`);
  if (pin) pin.classList.add('active');
}

function renderMapRadar() {
  const pinContainer = document.getElementById('map-pins-container');
  if (!pinContainer) return;

  const vMulti = getVehicleMultiplier();

  pinContainer.innerHTML = AppState.spots.map(spot => {
    const weatherFactor = getWeatherMultiplier(spot.isCovered);
    const dynamicPrice = Math.max(15, Math.round(spot.basePrice * spot.demandMultiplier * vMulti * weatherFactor));
    const bubbleClass = spot.demandLevel === 'high' ? 'high' : spot.demandLevel === 'low' ? 'low' : '';

    return `
      <div class="map-pin ${AppState.selectedSpot?.id === spot.id ? 'active' : ''}" 
           id="pin-${spot.id}"
           style="left: ${spot.mapCoords.x}%; top: ${spot.mapCoords.y}%;"
           onclick="selectSpot('${spot.id}')"
           title="${spot.title} - ₹${dynamicPrice}/hr (Walk: ${spot.walkingTime})">
        <div class="pin-bubble ${bubbleClass}">
          <span class="pin-dot"></span>
          <span>₹${dynamicPrice}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ----------------------------------------------------
// Driver Booking Modal & Smart Pass Flow
// ----------------------------------------------------
let bookingDuration = 2; // Default 2 hours

function openBookingModal(spotId) {
  const spot = AppState.spots.find(s => s.id === spotId);
  if (!spot) return;
  AppState.selectedSpot = spot;

  const modal = document.getElementById('booking-modal');
  document.getElementById('modal-spot-title').textContent = spot.title;
  document.getElementById('modal-spot-location').textContent = spot.location;
  document.getElementById('modal-spot-host').textContent = spot.host;
  document.getElementById('modal-spot-rating').textContent = `★ ${spot.rating} (${spot.reviewsCount} reviews) • 🛡️ ${spot.fakeRiskScore}`;

  // Vehicle badge in modal
  const vText = AppState.vehicleType === 'bike' ? '🏍️ 2-Wheeler (50% Off)' : AppState.vehicleType === 'suv' ? '🚙 SUV Bay (+40%)' : '🚗 Standard Sedan';
  const vBadge = document.getElementById('modal-vehicle-badge');
  if (vBadge) vBadge.textContent = vText;

  // Pricing breakdown
  updateBookingBreakdown(spot, bookingDuration);

  modal.classList.add('active');
}

function setBookingDuration(hours) {
  bookingDuration = hours;
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-hours')) === hours);
  });
  if (AppState.selectedSpot) {
    updateBookingBreakdown(AppState.selectedSpot, hours);
  }
}

function updateBookingBreakdown(spot, hours) {
  const vMulti = getVehicleMultiplier();
  const weatherFactor = getWeatherMultiplier(spot.isCovered);
  const dynamicHourly = Math.max(15, Math.round(spot.basePrice * spot.demandMultiplier * vMulti * weatherFactor));
  const baseHourly = Math.round(spot.basePrice * vMulti);

  const totalBase = baseHourly * hours;
  const totalSurge = Math.max(0, (dynamicHourly - baseHourly) * hours);
  const grossTotal = dynamicHourly * hours;
  
  // Platform commission (15%) included in the total economics
  const commission = Math.round(grossTotal * 0.15);
  const hostEarnings = grossTotal - commission;

  document.getElementById('calc-base-rate').textContent = `₹${baseHourly} × ${hours} hr = ₹${totalBase}`;
  const surgeRow = document.getElementById('calc-surge-row');
  if (totalSurge > 0) {
    surgeRow.style.display = 'flex';
    document.getElementById('calc-surge-val').textContent = `+ ₹${totalSurge} (${spot.surgeReason})`;
  } else {
    surgeRow.style.display = 'none';
  }

  document.getElementById('calc-total-pay').textContent = `₹${grossTotal}`;
  document.getElementById('calc-host-share').textContent = `₹${hostEarnings}`;
  document.getElementById('calc-platform-commission').textContent = `₹${commission} (15%)`;
}

function confirmBookingPayment() {
  const modal = document.getElementById('booking-modal');
  modal.classList.remove('active');

  const spot = AppState.selectedSpot;
  const vMulti = getVehicleMultiplier();
  const weatherFactor = getWeatherMultiplier(spot.isCovered);
  const dynamicHourly = Math.max(15, Math.round(spot.basePrice * spot.demandMultiplier * vMulti * weatherFactor));
  const grossTotal = dynamicHourly * bookingDuration;
  const otpCode = Math.floor(1000 + Math.random() * 9000);

  // Activate active session tracker with new booking
  AppState.activeSession.active = true;
  AppState.activeSession.spotName = spot.title;
  AppState.activeSession.slotNumber = "B-08";
  AppState.activeSession.totalSecondsRemaining = bookingDuration * 3600;
  setupActiveSessionTimer();

  // Open Pass Modal
  const passModal = document.getElementById('pass-modal');
  document.getElementById('pass-spot-name').textContent = spot.title;
  document.getElementById('pass-address').textContent = spot.location;
  document.getElementById('pass-time').textContent = `Valid for ${bookingDuration} Hours (Until ${getFormattedExpiryTime(bookingDuration)})`;
  document.getElementById('pass-otp-code').textContent = otpCode;
  document.getElementById('pass-amount-paid').textContent = `₹${grossTotal} (Paid via UPI)`;
  
  passModal.classList.add('active');
  showToast("🎉 Booking Confirmed! Entry OTP & Smart QR Pass Generated.", "success");
}

function getFormattedExpiryTime(hoursAhead) {
  const now = new Date();
  now.setHours(now.getHours() + hoursAhead);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ----------------------------------------------------
// Tab 2: Host / Owner Studio
// ----------------------------------------------------
function setupHostStudio() {
  const propButtons = document.querySelectorAll('.prop-type-btn');
  propButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      propButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      recalcOwnerAiPricing();
    });
  });

  const localityInput = document.getElementById('owner-locality-select');
  if (localityInput) {
    localityInput.addEventListener('change', recalcOwnerAiPricing);
  }

  const scheduleSelect = document.getElementById('owner-schedule-select');
  if (scheduleSelect) {
    scheduleSelect.addEventListener('change', recalcOwnerAiPricing);
  }

  const listForm = document.getElementById('list-space-form');
  if (listForm) {
    listForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAddNewSpot();
    });
  }

  recalcOwnerAiPricing();
}

function recalcOwnerAiPricing() {
  const activeProp = document.querySelector('.prop-type-btn.active')?.getAttribute('data-type') || 'home';
  const locality = document.getElementById('owner-locality-select')?.value || 'indiranagar';

  let predictedDemand = "HIGH (91%)";
  let suggestedBase = 30;
  let peakSurge = 45;
  let estimatedMonthly = 12600;
  let rationale = "";

  if (activeProp === 'office') {
    predictedDemand = "VERY HIGH (94%)";
    suggestedBase = 35;
    peakSurge = 50;
    estimatedMonthly = 16800;
    rationale = "Office spaces after 6 PM unlock massive demand in commercial corridors. EV charging adds ~35% premium.";
  } else if (activeProp === 'shop') {
    predictedDemand = "MEDIUM-HIGH (82%)";
    suggestedBase = 30;
    peakSurge = 42;
    estimatedMonthly = 9400;
    rationale = "Retail shop fronts offer street-level accessibility for nightlife and midnight delivery transit.";
  } else {
    predictedDemand = "HIGH (88%)";
    suggestedBase = 30;
    peakSurge = 45;
    estimatedMonthly = 11200;
    rationale = "Residential driveways near high-density roads enjoy steady weekend and evening visitor bookings.";
  }

  const demandElem = document.getElementById('owner-ai-demand-score');
  const baseElem = document.getElementById('owner-ai-suggested-base');
  const peakElem = document.getElementById('owner-ai-peak-price');
  const monthlyElem = document.getElementById('owner-ai-monthly-earnings');
  const rationaleElem = document.getElementById('owner-ai-rationale');

  if (demandElem) demandElem.textContent = predictedDemand;
  if (baseElem) baseElem.textContent = `₹${suggestedBase}/hr`;
  if (peakElem) peakElem.textContent = `₹${peakSurge}/hr`;
  if (monthlyElem) monthlyElem.textContent = `₹${estimatedMonthly.toLocaleString()}`;
  if (rationaleElem) rationaleElem.textContent = rationale;
}

function handleAddNewSpot() {
  const title = document.getElementById('owner-space-title').value;
  const address = document.getElementById('owner-space-address').value;
  const locality = document.getElementById('owner-locality-select').value;
  const propType = document.querySelector('.prop-type-btn.active')?.getAttribute('data-type') || 'home';
  
  const amenities = [];
  if (document.getElementById('check-ev')?.checked) amenities.push("⚡ EV Fast Charger");
  if (document.getElementById('check-cctv')?.checked) amenities.push("📹 24/7 CCTV");
  if (document.getElementById('check-covered')?.checked) amenities.push("☂️ Roof Covered");
  if (document.getElementById('check-guard')?.checked) amenities.push("🛡️ Security Guard");

  const newSpot = {
    id: `spot-${Date.now()}`,
    title: title || "New Verified Smart Space",
    type: propType,
    typeLabel: propType === 'home' ? '🏠 Home Driveway' : propType === 'office' ? '🏢 Office Parking' : '🏬 Retail Shop',
    typeTagClass: propType === 'home' ? 'tag-home' : propType === 'office' ? 'tag-office' : 'tag-shop',
    location: address || "Indiranagar, Bangalore",
    locality: locality,
    landmarkNear: "indiranagar100",
    host: "You (Verified Host)",
    rating: 5.0,
    reviewsCount: 1,
    basePrice: 30,
    demandLevel: 'high',
    demandMultiplier: 1.5,
    surgeReason: "AI Initial Demand Projection",
    features: amenities.length > 0 ? amenities : ["📹 24/7 CCTV", "🚗 Gated Entry"],
    availability: "Flexible Daily Windows",
    distance: "150m away",
    distanceMeters: 150,
    walkingTime: "2 min walk",
    walkScore: 94,
    ecoScore: "Saves 1.5kg CO2 (A)",
    isCovered: document.getElementById('check-covered')?.checked || false,
    groupParkingCapable: propType === 'office',
    fakeRiskScore: "0.2% (VERIFIED GREEN)",
    mapCoords: { x: Math.floor(25 + Math.random() * 50), y: Math.floor(25 + Math.random() * 50) },
    spotsAvailable: 1,
    occupancyRate: 85,
    description: "Newly listed smart space with instant AI pricing enabled. Secure access with OTP verification."
  };

  AppState.spots.unshift(newSpot);
  renderSpots();
  renderMapRadar();

  showToast(`🎉 Space Listed Successfully! AI Dynamic Pricing is active.`, 'success');
  
  // Switch to driver tab to inspect
  setTimeout(() => {
    switchTab('driver');
    selectSpot(newSpot.id);
  }, 1200);
}

// ----------------------------------------------------
// Tab 3: AI Pricing Engine Simulator
// ----------------------------------------------------
function setupSimulator() {
  const daySlider = document.getElementById('sim-day-slider');
  const timeSlider = document.getElementById('sim-time-slider');
  const localitySelect = document.getElementById('sim-locality-select');
  const eventSelect = document.getElementById('sim-event-select');
  const occSlider = document.getElementById('sim-occupancy-slider');

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (daySlider) {
    daySlider.addEventListener('input', (e) => {
      AppState.simulator.dayOfWeek = parseInt(e.target.value);
      document.getElementById('sim-day-val').textContent = days[AppState.simulator.dayOfWeek];
      updateSimulatorResults();
    });
  }

  if (timeSlider) {
    timeSlider.addEventListener('input', (e) => {
      AppState.simulator.timeOfDay = parseInt(e.target.value);
      const formatted = `${AppState.simulator.timeOfDay.toString().padStart(2, '0')}:00`;
      document.getElementById('sim-time-val').textContent = formatted;
      updateSimulatorResults();
    });
  }

  if (localitySelect) {
    localitySelect.addEventListener('change', (e) => {
      AppState.simulator.localityType = e.target.value;
      updateSimulatorResults();
    });
  }

  if (eventSelect) {
    eventSelect.addEventListener('change', (e) => {
      AppState.simulator.eventMultiplier = parseFloat(e.target.value);
      updateSimulatorResults();
    });
  }

  if (occSlider) {
    occSlider.addEventListener('input', (e) => {
      AppState.simulator.localOccupancy = parseInt(e.target.value);
      document.getElementById('sim-occ-val').textContent = `${AppState.simulator.localOccupancy}%`;
      updateSimulatorResults();
    });
  }
}

function updateSimulatorResults() {
  const sim = AppState.simulator;
  const base = sim.basePrice;

  // Mathematical Model:
  // 1. Time Factor (Peaks at 09:00 office & 18:00-22:00 evening dining/nightlife)
  let timeWeight = 0.5;
  if (sim.timeOfDay >= 18 && sim.timeOfDay <= 22) {
    timeWeight = 1.0;
  } else if (sim.timeOfDay >= 8 && sim.timeOfDay <= 11) {
    timeWeight = 0.85;
  } else if (sim.timeOfDay >= 12 && sim.timeOfDay <= 17) {
    timeWeight = 0.65;
  } else {
    timeWeight = 0.35;
  }

  // 2. Day Weight
  let dayWeight = 0.6;
  if (sim.dayOfWeek === 5) { // Friday
    dayWeight = 1.0;
  } else if (sim.dayOfWeek === 6 || sim.dayOfWeek === 0) { // Sat/Sun
    dayWeight = 0.9;
  } else {
    dayWeight = 0.7;
  }

  // 3. Locality Weight
  let localityWeight = 1.0;
  if (sim.localityType === 'entertainment') localityWeight = 1.15;
  if (sim.localityType === 'commercial') localityWeight = 1.1;
  if (sim.localityType === 'tech_park') localityWeight = 1.05;
  if (sim.localityType === 'residential') localityWeight = 0.85;

  // 4. Occupancy Surge Component
  const occFactor = (sim.localOccupancy / 100);

  // Aggregate Demand Index (0 - 100)
  const compositeDemand = Math.min(100, Math.round(
    (timeWeight * 30 + dayWeight * 25 + occFactor * 30) * sim.eventMultiplier * (localityWeight * 0.9)
  ));

  let multiplier = 0.65 + (compositeDemand / 100) * 0.85;
  const suggestedPrice = Math.round(base * multiplier);

  // Platform Cut (15%)
  const commission = Math.round(suggestedPrice * 0.15);
  const hostPayout = suggestedPrice - commission;

  // Update DOM Elements
  const demandScoreElem = document.getElementById('sim-demand-score');
  const demandCategoryElem = document.getElementById('sim-demand-category');
  const suggestedPriceElem = document.getElementById('sim-suggested-price');
  const commissionElem = document.getElementById('sim-commission-val');
  const hostPayoutElem = document.getElementById('sim-host-payout');
  const formulaPill = document.getElementById('sim-formula-pill');

  if (demandScoreElem) demandScoreElem.textContent = compositeDemand;
  if (demandCategoryElem) {
    if (compositeDemand > 75) {
      demandCategoryElem.innerHTML = `<span class="demand-badge demand-high">🔥 HIGH SURGE DEMAND</span>`;
    } else if (compositeDemand >= 45) {
      demandCategoryElem.innerHTML = `<span class="demand-badge demand-medium">⚡ MEDIUM DEMAND</span>`;
    } else {
      demandCategoryElem.innerHTML = `<span class="demand-badge demand-low">🟢 LOW DEMAND (OFF-PEAK)</span>`;
    }
  }

  if (suggestedPriceElem) suggestedPriceElem.textContent = `₹${suggestedPrice}`;
  if (commissionElem) commissionElem.textContent = `₹${commission}/hr (15%)`;
  if (hostPayoutElem) hostPayoutElem.textContent = `₹${hostPayout}/hr (85%)`;

  if (formulaPill) {
    formulaPill.textContent = `Base ₹${base} × Multiplier ${multiplier.toFixed(2)}x = ₹${suggestedPrice}/hr`;
  }

  render24HrCurve(sim);
}

function render24HrCurve(sim) {
  const svg = document.getElementById('sim-curve-svg');
  if (!svg) return;

  const points = [];
  const hours = 24;
  const width = 500;
  const height = 140;

  for (let h = 0; h < hours; h++) {
    let tW = (h >= 18 && h <= 22) ? 1.0 : (h >= 8 && h <= 11) ? 0.85 : (h >= 12 && h <= 17) ? 0.65 : 0.35;
    let score = (tW * 35 + (sim.dayOfWeek === 5 ? 1.0 : 0.7) * 25 + (sim.localOccupancy / 100) * 30) * sim.eventMultiplier;
    let price = Math.round(30 * (0.65 + (score / 100) * 0.85));

    const x = (h / 23) * width;
    const y = height - ((price - 15) / 45) * height;
    points.push({ x, y, price, hour: h });
  }

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const currentX = (sim.timeOfDay / 23) * width;
  const currentPoint = points[sim.timeOfDay];

  svg.innerHTML = `
    <defs>
      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
      </linearGradient>
    </defs>
    <line x1="0" y1="35" x2="${width}" y2="35" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
    <line x1="0" y1="70" x2="${width}" y2="70" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
    <line x1="0" y1="105" x2="${width}" y2="105" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4" />
    <path d="${areaD}" fill="url(#chartGrad)" />
    <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" />
    <line x1="${currentX}" y1="0" x2="${currentX}" y2="${height}" stroke="#10b981" stroke-width="2" stroke-dasharray="3" />
    <circle cx="${currentX}" cy="${currentPoint.y}" r="5" fill="#10b981" stroke="#000" stroke-width="2" />
    <text x="${currentX > 400 ? currentX - 60 : currentX + 8}" y="${currentPoint.y - 8}" fill="#10b981" font-size="11" font-weight="700">
      ${sim.timeOfDay}:00 → ₹${currentPoint.price}/hr
    </text>
  `;
}

// ----------------------------------------------------
// Tab 4: PFD & TFD Diagrams & Node Inspector
// ----------------------------------------------------
const DIAGRAM_SPECS = {
  'pfd-1': {
    title: "1. User Registration & Verification",
    badge: "IDENTITY & TRUST",
    description: "Parking owners verify property ownership via utility bill/Aadhaar/Lease; drivers verify phone number, driving license, and vehicle registration plate (e.g. KA-05-MK-9921).",
    payload: {
      action: "REGISTER_USER",
      role: "PARKING_OWNER",
      verification: "AADHAAR_OTP_VERIFIED",
      propertyDoc: "ELECTRICITY_BILL_HASH",
      status: "APPROVED_FOR_HOSTING"
    }
  },
  'pfd-2': {
    title: "2. Owner Adds Space & Availability",
    badge: "SUPPLY SIDE ONBOARDING",
    description: "Host inputs location, photos, dimensions, gate clearance, amenities (EV plug, CCTV, roof), and active time window (e.g. Mon-Fri 6 PM - 8 AM).",
    payload: {
      action: "ADD_PARKING_SLOT",
      hostId: "usr_sharma_98",
      geo: { lat: 12.9784, lng: 77.6408 },
      slotType: "RESIDENTIAL_DRIVEWAY",
      schedule: "MON_FRI_1800_TO_0800",
      evCharging: true
    }
  },
  'pfd-3': {
    title: "3. AI Estimates Demand & Suggests Price",
    badge: "AI INFERENCE ENGINE",
    description: "The AI pricing model evaluates local historical bookings, events (Chinnaswamy cricket match), day of week, and nearby road traffic to output recommended dynamic pricing tiers.",
    payload: {
      action: "PREDICT_DEMAND_AND_PRICE",
      slotId: "slot_indiranagar_04",
      inputFeatures: { timeOfDay: 19, dayOfWeek: "FRIDAY", eventProximityKm: 2.1, localOccupancyRate: 0.92 },
      modelOutput: { demandScore: 91, basePrice: 30, surgeMultiplier: 1.5, finalSuggestedPrice: 45 }
    }
  },
  'pfd-4': {
    title: "4. Driver Location Search & Recommendations",
    badge: "GEOSPATIAL DISCOVERY",
    description: "Driver opens app, enters destination (e.g., '100ft Road, Indiranagar'). Spatial KNN queries in PostGIS return nearest available vetted slots ranked by distance, price, and rating.",
    payload: {
      action: "SEARCH_PARKING",
      destination: { lat: 12.9788, lng: 77.6412 },
      radiusKm: 1.0,
      filter: { instantBook: true, evCharger: true },
      resultsCount: 8
    }
  },
  'pfd-5': {
    title: "5. Slot Selection & Escrow Payment",
    badge: "TRANSACTION CHECKOUT",
    description: "Driver reviews transparent pricing (Base ₹30 + Surge ₹15 = ₹45/hr), duration, and makes payment via UPI/Card. Funds are held in marketplace escrow until parking completion.",
    payload: {
      action: "INITIATE_BOOKING",
      bookingId: "bk_9938120",
      driverId: "drv_arun_24",
      totalGross: 90,
      platformFee15Pct: 13.5,
      escrowStatus: "FUNDS_LOCKED_PENDING_PARK"
    }
  },
  'pfd-6': {
    title: "6. Digital Pass, QR Entry & Parking Used",
    badge: "PHYSICAL EXECUTION",
    description: "Driver receives animated QR code and 4-digit Entry OTP. Upon arrival, host verifies OTP or smart IoT boom barrier scans QR code to grant entry. Session timer activates.",
    payload: {
      action: "CHECK_IN_SESSION",
      bookingId: "bk_9938120",
      entryTimestamp: "2026-09-29T19:04:12Z",
      gateVerification: "OTP_MATCH_SUCCESS",
      timerActiveMinutes: 120
    }
  },
  'pfd-7': {
    title: "7. Payment Release & ML Feedback Loop",
    badge: "SETTLEMENT & LEARNING",
    description: "When the driver checks out, escrow releases 85% payout to the host's UPI bank account. Both parties exchange ratings. Booking telemetry trains the AI model for higher future accuracy.",
    payload: {
      action: "COMPLETE_AND_FEEDBACK",
      hostPayoutReleased: "INR_76.50",
      driverRating: 5,
      actualDurationHours: 1.95,
      feedbackDataSentToAI: true
    }
  },

  'api-gateway': {
    title: "API Gateway & Authentication Service",
    badge: "GATEWAY & SECURITY",
    description: "Reverse proxy handling SSL termination, rate limiting, and JWT authentication with Role-Based Access Control (RBAC) separating Driver and Parking Owner scopes.",
    payload: {
      protocol: "HTTPS / REST / WebSocket",
      auth: "OAuth 2.0 + JWT (RS256)",
      rateLimit: "120 req/min per IP",
      latencyTarget: "< 15ms"
    }
  },
  'parking-db': {
    title: "Spatial Database & Cache Layer",
    badge: "POSTGRESQL + POSTGIS + REDIS",
    description: "Stores geospatial points, polygons, booking history, and active slot states. Uses PostGIS R-tree spatial indexing (`ST_DWithin`) for sub-10ms radial searches, and Redis mutex locks for double-booking prevention.",
    payload: {
      primaryDB: "PostgreSQL 16 + PostGIS 3.4",
      indexing: "GIST (geom_point)",
      sampleQuery: "SELECT id, title, ST_Distance(geom, ST_MakePoint(77.64, 12.97)::geography) FROM slots WHERE status = 'AVAILABLE' AND ST_DWithin(geom, ST_MakePoint(77.64, 12.97)::geography, 1000);",
      cache: "Redis 7 Cluster (Atomic slot locking via Redlock)"
    }
  },
  'ai-engine': {
    title: "AI Demand & Dynamic Pricing Engine",
    badge: "MACHINE LEARNING CORE",
    description: "Gradient boosted tree model (XGBoost / LightGBM) pre-trained on historical urban traffic and booking density. Predicts demand score (0-100) and computes supply/demand elasticity surge multiplier in < 35ms.",
    payload: {
      modelArchitecture: "LightGBM Regression Pipeline",
      features: ["hour_sin", "hour_cos", "day_of_week", "weather_rain_mm", "nearby_event_flag", "historical_occupancy_ratio"],
      inferenceLatency: "28ms p95",
      dynamicMultiplierRange: "0.65x to 1.60x"
    }
  },
  'rec-engine': {
    title: "Pareto Recommendation Engine",
    badge: "OPTIMIZATION LAYER",
    description: "Multi-objective ranking engine balancing Walking Distance vs Price vs Host Rating to deliver the top 3 best parking recommendations for any search query.",
    payload: {
      algorithm: "Pareto-optimal Score Weighted Ranking",
      weights: { walkingDistance: 0.45, price: 0.35, rating: 0.20 },
      responseSLA: "< 40ms"
    }
  },
  'payment-gateway': {
    title: "Payment Gateway & Escrow Ledger",
    badge: "PAYMENT RAILS",
    description: "Integrated with UPI AutoPay, Razorpay, and Stripe. Supports automatic split payouts (85% Host / 15% Platform Commission) with webhook verification and escrow safety hold.",
    payload: {
      rail: "UPI Deep-Link / Intent + Webhooks",
      escrowPolicy: "Funds held until driver QR check-out confirmation",
      splitPayout: "Direct-to-UPI (NPCI IMPS/NEFT automated transfer)"
    }
  },
  'booking-engine': {
    title: "Atomic Booking & QR/OTP Engine",
    badge: "CORE TRANSACTION ENGINE",
    description: "Guarantees zero double-booking using distributed locks. Issues cryptographically signed, time-bounded dynamic QR passes and 4-digit verification OTPs.",
    payload: {
      transactionLock: "Redis Redlock Mutex (120s expiry during checkout)",
      ticketSignature: "HMAC-SHA256 (bookingId + expiry + driverId)",
      passFormat: "Dynamic SVG QR + 4-digit numeric OTP"
    }
  },
  'alert-engine': {
    title: "Notification & Event Telemetry Bus",
    badge: "KAFKA + WEBSOCKETS + FCM",
    description: "Sends real-time push alerts to hosts when booking arrives; sends turn-by-turn navigation alerts to drivers; dispatches telemetry events to Kafka for continuous model training.",
    payload: {
      eventBus: "Apache Kafka / Redpanda",
      channels: ["Firebase Cloud Messaging (FCM)", "WhatsApp Business API", "Twilio SMS fallback"]
    }
  }
};

function setupDiagrams() {
  const pfdTabBtn = document.getElementById('btn-show-pfd');
  const tfdTabBtn = document.getElementById('btn-show-tfd');
  const aiTabBtn = document.getElementById('btn-show-ai-arch');

  if (pfdTabBtn) pfdTabBtn.addEventListener('click', () => switchDiagramTab('pfd'));
  if (tfdTabBtn) tfdTabBtn.addEventListener('click', () => switchDiagramTab('tfd'));
  if (aiTabBtn) aiTabBtn.addEventListener('click', () => switchDiagramTab('ai-arch'));

  const playPfdBtn = document.getElementById('btn-play-pfd-flow');
  if (playPfdBtn) playPfdBtn.addEventListener('click', playPfdSimulation);

  inspectDiagramNode('pfd-1');
}

function switchDiagramTab(tabName) {
  AppState.diagramTab = tabName;
  document.querySelectorAll('.diagram-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.diagram-view-pane').forEach(pane => pane.style.display = 'none');

  if (tabName === 'pfd') {
    document.getElementById('btn-show-pfd')?.classList.add('active');
    document.getElementById('pfd-canvas-view').style.display = 'block';
    inspectDiagramNode('pfd-1');
  } else if (tabName === 'tfd') {
    document.getElementById('btn-show-tfd')?.classList.add('active');
    document.getElementById('tfd-canvas-view').style.display = 'block';
    inspectDiagramNode('api-gateway');
  } else if (tabName === 'ai-arch') {
    document.getElementById('btn-show-ai-arch')?.classList.add('active');
    document.getElementById('ai-canvas-view').style.display = 'block';
    inspectDiagramNode('ai-engine');
  }
}

function inspectDiagramNode(nodeKey) {
  const spec = DIAGRAM_SPECS[nodeKey];
  if (!spec) return;

  const titleElem = document.getElementById('inspector-title');
  const badgeElem = document.getElementById('inspector-badge');
  const descElem = document.getElementById('inspector-desc');
  const payloadElem = document.getElementById('inspector-payload');

  if (titleElem) titleElem.textContent = spec.title;
  if (badgeElem) badgeElem.textContent = spec.badge;
  if (descElem) descElem.textContent = spec.description;
  if (payloadElem) payloadElem.textContent = JSON.stringify(spec.payload, null, 2);

  document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active-step'));
  const activeSvgNode = document.getElementById(`svg-node-${nodeKey}`);
  if (activeSvgNode) activeSvgNode.classList.add('active-step');
}

let pfdInterval = null;
function playPfdSimulation() {
  if (pfdInterval) {
    clearInterval(pfdInterval);
    pfdInterval = null;
  }

  const steps = ['pfd-1', 'pfd-2', 'pfd-3', 'pfd-4', 'pfd-5', 'pfd-6', 'pfd-7'];
  let currentIdx = 0;
  
  const playBtn = document.getElementById('btn-play-pfd-flow');
  if (playBtn) playBtn.textContent = "Simulating... ⏳";

  pfdInterval = setInterval(() => {
    inspectDiagramNode(steps[currentIdx]);
    currentIdx++;
    if (currentIdx >= steps.length) {
      clearInterval(pfdInterval);
      pfdInterval = null;
      if (playBtn) playBtn.textContent = "Replay Journey ▶️";
      showToast("Simulation Complete: Booking lifecycle executed successfully!", "success");
    }
  }, 1600);
}

// ----------------------------------------------------
// Tab 5: Ideathon Pitch Deck Navigation
// ----------------------------------------------------
function setupPitchDeck() {
  const prevBtn = document.getElementById('pitch-prev-btn');
  const nextBtn = document.getElementById('pitch-next-btn');

  if (prevBtn) prevBtn.addEventListener('click', () => changePitchSlide(AppState.currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => changePitchSlide(AppState.currentSlide + 1));

  window.addEventListener('keydown', (e) => {
    if (AppState.currentTab === 'pitch') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        changePitchSlide(AppState.currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        changePitchSlide(AppState.currentSlide - 1);
      }
    }
  });

  renderSlideDots();
}

function changePitchSlide(index) {
  if (index < 0) index = 0;
  if (index >= AppState.totalSlides) index = AppState.totalSlides - 1;

  AppState.currentSlide = index;

  document.querySelectorAll('.pitch-slide').forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });

  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });

  const countElem = document.getElementById('slide-counter-badge');
  if (countElem) {
    countElem.textContent = `Slide ${index + 1} of ${AppState.totalSlides}`;
  }
}

function renderSlideDots() {
  const container = document.getElementById('slide-dots-container');
  if (!container) return;

  container.innerHTML = Array.from({ length: AppState.totalSlides }).map((_, i) => `
    <div class="dot ${i === 0 ? 'active' : ''}" onclick="changePitchSlide(${i})" title="Slide ${i + 1}"></div>
  `).join('');
}

// ----------------------------------------------------
// Modal Dismissals & Utility
// ----------------------------------------------------
function setupModalDismissals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
