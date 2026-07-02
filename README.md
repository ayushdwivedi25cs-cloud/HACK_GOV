# AI Emergency Government Navigator

A full-stack AI-powered Government Emergency Assistance Platform built for the hackathon.

## Features

- 🚨 **SOS Modal** — 11 emergency categories with GPS capture & dispatch logger
- 👩 **Women's Safety SOS** — 1-tap activation with Web Audio API siren
- 🤖 **Multilingual AI Chatbot** — Speech-to-text, TTS, distress detection
- 🗺️ **Interactive Tactical Map** — SVG incident grid overlay
- 📊 **Admin Dashboard** — Live incident feed, heatmap, broadcast panel
- 🔬 **AI Scam Detector** — Phishing analysis with regex + Gemini AI
- 🎭 **Deepfake Forensics** — Upload & analyze media authenticity
- 🩺 **AI First Aid Guide** — Voice-guided steps for 10+ emergencies
- 🧑‍🤝‍🧑 **Missing Person Portal** — HTML5 Canvas poster builder
- 📋 **Government Guidance** — FIR procedures, document checklists
- 🔒 **JWT Auth** — Citizen registration + Admin login

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 2.5 Flash (with smart mock fallback) |
| Auth | JWT + bcrypt |

## Quick Start

### 1. Backend
```bash
cd backend
npm install
# Copy and configure environment:
cp .env.example .env
npm start
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackgov
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your_gemini_key_here  # Optional — smart mocks used if absent
```

## Demo Credentials

- **Admin:** `admin@hackgov.in` / `admin123`
- **Citizen:** Register via `/register` (requires 3 emergency contacts)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server status |
| POST | `/api/auth/register` | Citizen registration |
| POST | `/api/auth/login` | Login (citizen + admin) |
| POST | `/api/sos/trigger` | Trigger SOS emergency |
| GET | `/api/incidents/all` | All incidents (admin) |
| GET | `/api/incidents/analytics` | Analytics + heatmap (admin) |
| PUT | `/api/incidents/update/:id` | Update status (admin) |
| POST | `/api/ai/chat` | AI chatbot |
| POST | `/api/ai/scam-detect` | Scam analysis |
| POST | `/api/ai/deepfake-detect` | Deepfake forensics |
| POST | `/api/missing-person/report` | File missing person report |
