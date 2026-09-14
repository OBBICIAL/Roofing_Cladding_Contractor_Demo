# TradeOS: Roofing & Cladding Contractor Demo - Build Brief

This document serves as a comprehensive overview of the current state of the TradeOS Roofing & Cladding Demo Application. It is designed to be fed into an LLM (like Gemini) to provide full context on what has been built, how the interface functions, and what the specific user flows are, allowing for seamless future iteration and improvement.

## 1. Aesthetic & Visual Identity
- **Theme**: Dark Industrial Solar Console. Deep dark backgrounds (`zinc-950` and `zinc-900`) with high-contrast metric text.
- **Accents**: 
  - **Safety Amber** (`#F59E0B`) for action items, notifications, and triage warnings.
  - **Emerald-500** (`#10B981`) for pipeline revenue, verified checks, and positive compliance.
  - **Slate Blue** (`#3B82F6`) for active interactions and primary CTAs.
- **Layout**: Single-page horizontal grid setup (12 columns). 7 columns for the Left Panel (Executive Dashboard) and 5 columns for the Right Panel (Interactive Mobile Simulator).
- **Navigation**: Sticky top header with scroll-tracking anchor links (Full Cockpit, Old/Dead Quote Reactivation, Speed-to-Lead & Triage, Docs & Regs Chaser).

---

## 2. Left Panel: Executive Operations Hub
The left panel acts as the contractor's internal "God Mode" view, broken into interconnected feature modules.

### Top KPI Summary Strip
- **Speed-to-Lead Response**: 38 Seconds (Missed Call -> WhatsApp Handshake).
- **Office Desk Time Saved**: 18.5 Hrs/Wk (Eliminating phone tag).
- **BCAR & Tech Compliance**: 100% Pre-Checked (Verifying ridge heights and spans).
- **Reactivated Pipeline**: Dynamic € value representing "Found Cash", tethered mathematically to the Sleeping Beauty engine.

### Feature 1: 24/7 Speed-To-Lead & Inbound Triage
- **Concept**: A pre-qualification engine that acts as a digital bouncer.
- **Purpose**: Instantly filters high-value leads (e.g., €35k attic conversions) from low-value or non-compliant ones (e.g., attics with sub-2.3m ridge heights) to prevent wasted estimator travel time.

### Feature 2: BCAR Part L & Insurance Damage Chaser
- **Concept**: Automated compliance and documentation workflow.
- **Contents**: A 4-grid dispatch board showing active job statuses:
  - *Emergency Slate Repair (Celbridge)* - AI OCR verifying valley leaks.
  - *Full Attic Conversion (Maynooth)* - Truss alterations flagged.
  - *Natural Slate Re-Roof (Clane)* - SEAI Grant pre-checks queued.
  - *Commercial Torch-on Felt (Naas)* - 48hr Drone surveys generated.

### Feature 3: Sleeping Beauty Quote Revival Engine
- **Concept**: Database reactivation for dormant/dead quotes (6-18 months old).
- **Interactivity**: Features a live range slider (20 to 300 quotes).
- **Mechanics**: Moving the slider calculates a fixed 22% reactivation rate, multiplying the resulting booked surveys by an average €14,500 ticket value to show "Found Cash".
- **Visuals**: A 4-stage Kanban board (Kiss Sent -> Replied -> Scope Qualified -> Survey Locked). The numbers in these columns dynamically scale as the slider moves.

### Feature 4: Post-Sale Reputation & Review Engine
- **Concept**: Final invoice clearance trigger.
- **Visual**: Shows a completed Dormer Attic Conversion in Straffan triggering an automated WhatsApp ping to the homeowner requesting a 5-star Google Review.

---

## 3. Right Panel: Mobile Simulator (Dual-Mode)
An interactive iPhone-styled frame that simulates what the homeowner sees and experiences. It has two toggleable modes.

### Mode A: Homeowner Intake Funnel (Instant Quote Engine)
A 4-step progressive web app form for inbound leads:
1. **Property Location**: Eircode input triggering a mock "Leinster autofill".
2. **Job Type**: User selects from Emergency Leak, Slate/Tile Re-Roof, Velux Attic, or Commercial Flat Roof.
3. **Dynamic Feasibility Filter**:
   - If *Attic* is selected: Asks if the internal ridge height is >2.3m (Yes / Not Sure / Low Ceiling).
   - If *Leak* is selected: Asks if water is actively dripping into living space (Emergency / No).
4. **Site Photos**: A mock drag-and-drop zone for roof photos.

### Mode B: Sales SMS Simulator (Emma AI Desk)
An iOS iMessage simulation demonstrating how the AI Assistant ("Emma") reactivates dormant leads via SMS.
- **Audio Integration**: Uses the Web Audio API to play authentic iOS "send" swooshes and "ding" receipt notifications.

#### The Conversation Flow Script
1. **Emma (System AI)**: *"Hi John, it’s Emma from Gleason Roofing & Carpentry desk. Is this still the same John that had us out for an attic conversion estimate a while back?"*
2. **John (Homeowner)**: *"Yes still me. We put it on ice because timber prices were mental last year."*
3. **Emma (System AI)**: *"Completely fair! Structural C24 timber and insulation costs have leveled off nicely over the last few months. Sean has a survey van in your estate on Thursday at 10:00 or Friday at 2:00 if you want him to check the rafter spans and refresh your quote for free?"*

#### User Interaction Options (Quick Replies)
The user operating the demo can click one of three mock responses for John:

- **Option A: *"Thursday at 10:00 suits perfectly."*** 
  - *Triggered Action*: Shows a typing indicator (`...`), plays the send sound.
  - *System Response*: Emma confirms *"Site survey locked for Thursday 10:00 AM • Sean dispatched"*. Plays the 'ding' notification.
  - *Cross-Panel Sync*: A `+1 NEW` badge animates onto the "Survey Locked" Kanban column on the left panel, demonstrating real-time pipeline updating.
  
- **Option B: *"Roughly what are you charging per sq metre now?"***
  - *Triggered Action*: Shows a typing indicator.
  - *System Response*: Generic fallback response (*"I'll update your file. Let me know if you need anything in the future!"*).

- **Option C: *"Already got it done, thanks."***
  - *Triggered Action*: Shows a typing indicator.
  - *System Response*: Generic fallback response.

---

## 4. Current State & Technical Foundation
- **Framework**: Next.js (App Router), React 19.
- **Styling**: Tailwind CSS v4, Lucide React (Icons).
- **Animation**: `framer-motion` for layout transitions, typing indicators, and Kanban highlights.
- **Architecture**: It is a purely client-side simulation (`"use client"`). All data is hardcoded state meant specifically for a 15-minute high-end client walkthrough presentation.
