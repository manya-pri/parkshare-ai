# 🚗 ParkShare AI — Smart Parking Slot Renting Marketplace

> **"Airbnb for Parking Slots — Powered by Uber-like Dynamic Pricing AI"**  
> Monetize idle private driveways, corporate IT park lots after 6 PM, and retail shop bays overnight while solving urban traffic congestion.

---

## 🌟 Executive Summary

In modern tier-1 cities (such as Bengaluru, Mumbai, and Delhi-NCR), **30% of downtown traffic is caused solely by drivers cruising in search of parking**. Meanwhile:
- 🏠 **Homeowners** have empty driveways and gates during office hours or quiet weekends.
- 🏢 **Offices and Tech Parks** have hundreds of gated basement/visitor slots sitting 100% empty after 6:00 PM and all weekend.
- 🏬 **Retail shops & bookstores** have customer bays sitting empty and unmonetized overnight (8 PM – 9 AM).

**ParkShare AI** turns this dead asset into recurring passive income for property owners while providing drivers with guaranteed, pre-booked parking at fair, AI-optimized dynamic rates.

---

## 💰 Business & Revenue Model

- **Marketplace Take-Rate**: 15% platform commission on every booking.
- **Host Payout**: 80% – 85% net revenue released instantly to host's UPI bank account upon checkout.
- **Dynamic Pricing Elasticity**:
  - **Low Demand (Off-peak late morning/quiet residential):** ₹20/hr (incentivizes booking).
  - **Standard Rate (Normal weekday traffic):** ₹30/hr.
  - **High Demand (Friday evening rush / Stadium cricket match / Concerts):** ₹45 – ₹50/hr (+50% to +66% surge).
- **Unit Economics (Bangalore Pilot Target)**:
  - 1,200 active parking slots × 30 bookings/month = **36,000 monthly bookings**.
  - Average transaction: 2.5 hours @ ₹40/hr = **₹100 Gross Transaction Value (GTV)**.
  - Monthly Gross Merchandise Value: **₹36 Lakhs**.
  - Monthly Net Revenue (15%): **₹5.4 Lakhs** (**₹65 Lakhs ARR** at just 0.5% market capture in 1 city).

---

## 📊 1. Process Flow Diagram (PFD)

The user-focused business journey showing how Parking Owners and Drivers interact with the platform:

```
                    PARKSHARE AI
                         │
          ┌──────────────┴──────────────┐
          │                             │
     PARKING OWNER                  DRIVER
          │                             │
          ▼                             ▼
   Register / Login              Register / Login
          │                             │
          ▼                             ▼
 Add Parking Space              Enter Location
          │                             │
          ▼                             ▼
 Set Availability               Search Parking
 (Time + Date)                       │
          │                          ▼
          ▼                    View Available
 AI Estimates Demand              Parking
          │                          │
          ▼                          ▼
 AI Suggests Price             Select Parking
          │                          │
          ▼                          ▼
 Parking Listed               Make Payment
          │                          │
          └──────────────┬───────────┘
                         ▼
                   Booking Confirmed (Dynamic QR + OTP)
                         │
                         ▼
                  Parking Used
                         │
                         ▼
                 Payment Released (Escrow to Host)
                         │
                         ▼
                  Rating / Review
                         │
                         ▼
                  AI Learns From Booking Data
```

---

## ⚙️ 2. Technical Flow Diagram (TFD)

The production-grade full-stack architecture detailing subsystems, protocols, and latency targets:

```
┌──────────────────────────────────────────────┐
│           DRIVER & OWNER WEB / APP           │
│     (Responsive PWA / React / Geolocation)   │
└──────────────────────┬───────────────────────┘
                       │ HTTPS / WSS (< 20ms)
                       ▼
┌──────────────────────────────────────────────┐
│              FRONTEND & API GATEWAY          │
│       Rate Limiting • JWT Auth (RBAC)        │
└──────────────┬───────────────────────────────┘
               │
        ┌──────┴────────────────────────┐
        ▼                               ▼
┌─────────────────────────┐   ┌───────────────────────────┐
│     USER & AUTH SVC     │   │   PARKING GEODATABASE     │
│   Aadhaar / DL Verify   │   │ PostgreSQL 16 + PostGIS   │
└─────────────────────────┘   │ ST_DWithin Spatial R-Tree │
                              │ Redis 7 Distributed Locks │
                              └─────────────┬─────────────┘
                                            │ Spatial Feature Vectors
                                            ▼
                              ┌───────────────────────────┐
                              │      AI ENGINE CORE       │
                              │ LightGBM Regression Model │
                              │ Demand Scoring (0 - 100)  │
                              │ Dynamic Pricing Suggester │
                              └─────────────┬─────────────┘
                                            │ Top Candidates & Prices
                                            ▼
                              ┌───────────────────────────┐
                              │   RECOMMENDATION ENGINE   │
                              │ Pareto Optimization Layer │
                              │ (Distance vs Price vs ★)  │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │  PAYMENT GATEWAY & ESCROW │
                              │ UPI Autopay / Webhooks    │
                              │ 15% Platform / 85% Host   │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │  BOOKING & ACCESS ENGINE  │
                              │ Double-Booking Prevention │
                              │ Dynamic QR + 4-Digit OTP  │
                              └─────────────┬─────────────┘
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │  NOTIFICATION & TELEMETRY │
                              │ FCM Alerts • Twilio SMS   │
                              │ Kafka Retraining Stream   │
                              └───────────────────────────┘
```

---

## 🤖 3. The AI Demand & Dynamic Pricing Engine

### Why AI is Essential (Not Just Decoration):
Traditional parking systems use rigid, flat-rate tariffs (e.g. ₹50 flat) which causes:
1. Under-utilization during morning off-peak hours (spots remain empty).
2. Extreme gridlock during Friday evenings and stadium matches because price does not reflect high demand elasticity.

### Feature Matrix:
$$\mathbf{X} = \{ \text{hour\_sin}, \text{hour\_cos}, \text{day\_of\_week}, \text{locality\_type}, \text{event\_multiplier}, \text{local\_occupancy\_rate}, \text{weather\_rain\_mm} \}$$

### Pricing Formulation:
1. **Demand Score Calculation ($D \in [10, 100]$)**:
   $$D = \min\left(100, \left( w_{\text{time}} \cdot 30 + w_{\text{day}} \cdot 25 + \text{Occupancy} \cdot 30 \right) \times M_{\text{event}} \times L_{\text{type}} \right)$$
2. **Elasticity Surge Multiplier ($S$)**:
   $$S = 0.65 + \left(\frac{D}{100}\right) \times 0.85$$
3. **Final Hourly Suggested Price ($P$)**:
   $$P = \text{round}(P_{\text{base}} \times S)$$
   - Low Demand: **₹20/hr**
   - Medium Demand: **₹30/hr**
   - High Demand Surge: **₹45 – ₹50/hr**

---

## 🚀 Live Interactive Web Application Prototype

The project includes a ready-to-demo web application with 5 interactive modules:
1. 🚗 **Driver Marketplace**: Real-time slot search, interactive visual city radar with street overlay, dynamic surge badges, and 1-click booking checkout.
2. 🏠 **Host & Owner Studio**: Property type selector (Driveway, Office, Shop), schedule selector, and live AI price recommendation calculator.
3. ⚡ **AI Pricing Engine Simulator**: Interactive sandbox with sliders for Day, Time, Locality, Nearby Events, and Occupancy to test the dynamic pricing curve in real-time.
4. 📊 **PFD & TFD Visualizer**: Interactive SVG diagrams with a "Play Journey" simulation and Technical Node Inspector displaying live JSON payloads.
5. 🎯 **Ideathon Pitch Deck**: 10-slide presentation mode for judges covering problem, solution, unit economics, cold-start strategy, and competitive moats.

### Running the Application:
The server is currently running locally at:
👉 **`http://localhost:3000/`**

To restart manually at any time:
```bash
node serve.js
```
Or simply open `index.html` in any web browser!
