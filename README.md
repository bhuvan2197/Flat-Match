# FlatMatch 🏠🇮🇳
> **"Because 'chill person' isn't a personality match."**  
> Premium, production-grade web app for India that matches people with flatmates who **actually live like them**, not just anyone who can split rent.

---

## 🚀 Key Highlights & Design System
- **Dark, neo-brutalist meets fintech**: Near-black background (`#0A0A0A`), sleek cards (`#111413`), dark mint selection tint (`#16201D`), 1px coloured attribute borders, and solid mint highlight blocks (`#3DDBA5`) with -1deg rotation.
- **Strict Attribute Colour Map**:
  - 🟡 **Budget**: `#F5C230` (Yellow)
  - 🔵 **Location**: `#45B5F5` (Blue)
  - 🔴 **Sleep Schedule**: `#FF5C8D` (Pink)
  - 🟢 **Cleanliness & Chores**: `#3DDBA5` (Mint)
  - 🟡 **Smoking & Drinking**: `#F5C230` (Yellow)
- **Subtle Film-Grain Noise Overlay** (3.5% opacity) for high-end tactile feel.
- **Framer Motion spring physics** (`stiffness: 260, damping: 24`).

---

## 🧠 How the Match Compatibility Engine Works (`matchEngine.ts`)

The algorithm transparently evaluates compatibility across 7 key lifestyle dimensions:
1. **Sleep Schedule Sync (Weight: 25%)**: Evaluates bedtime alignment (before 10 PM, by 11 PM, midnight, 2 AM+ night owl). Exact sync = 100%, 1-tier difference = 80%, 2 tiers = 50%, 3 tiers = 20%.
2. **Cleanliness & Chores (Weight: 25%)**: Compares daily counters & dishes hygiene vs weekly/when-messy standards.
3. **Smoking & Substance Policy (Weight: 20%)**: Strict non-smoker vs balcony smoker vs indoor smoker compatibility.
4. **Budget Overlap (Weight: 15%)**: Evaluates range overlap in INR (`₹5K – ₹60K`).
5. **Food Preference (Weight: 5%)**: Pure veg / Jain kitchen separation respect vs non-veg.
6. **Guest & Weekend Policy (Weight: 5%)**: Overnight guests tolerance.
7. **Noise & WFH Silence (Weight: 5%)**: Pin-drop quiet vs background music vs party-friendly.

### Strict Deal-Breakers:
When a user sets any deal-breaker (e.g. strict non-smoker or 11 PM sleep):
- Any mismatch caps the overall score at **39%** max.
- Displays an amber deal-breaker alert banner explaining the exact clash.

---

## 🛡️ The 3-Step Safe Path ("Before You Sign Anything")
Replicates the video's safe handshake:
1. **CHAT (Blue)**: Vibe check DM, 10 smart conversation starters, and a shared **Vibe Check Card** comparing 5 essential roommate habits.
2. **VERIFY IDs (Mint)**: 4-tier safety check: Phone OTP, Government ID document scan preview, 3D facial liveness check, and corporate/college work email domain badge.
3. **MEET FIRST (Yellow)**: Suggests verified public meeting spots (Third Wave Coffee, Blue Tokai, Araku, Starbucks), date/time scheduler, emergency contact share sheet, and "I've arrived safely" check-in button with post-meeting feedback.

---

## 🛠️ Post-Match Tools Included
- **Rent & Expense Splitter**: Ledger with split rent, electricity, high-speed WiFi, groceries, maid, and automated "Who Owes Whom" net balance calculation.
- **House Rules Agreement Generator**: Auto-generates a 1-page mutual living compact (quiet hours, cleaning rota, notice period) and **downloads as PDF** client-side via `jsPDF`.
- **Weekly Chore Rota**: Interactive rotating chore board with drag-to-swap and one-click completion.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Instant search across 40+ Indian profiles and app shortcuts.
- **9:16 Instagram Story Export**: Download living archetype card directly as an image via `html-to-image`.

---

## 💻 Tech Stack
- **React 18 + Vite + TypeScript**
- **Tailwind CSS** with custom design tokens
- **Framer Motion**
- **Zustand** with persistent `localStorage`
- **Lucide React** (outline icons)
- **jsPDF** & **html-to-image**
- **Fonts**: Inter Tight, Inter, JetBrains Mono

---

## ⚡ Setup & Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:3000` to launch FlatMatch.

