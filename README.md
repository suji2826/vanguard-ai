# 🛡️ VANGUARD AI - Autonomous Enterprise Protection Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vanguard-ai-12bac.web.app)
[![Backend](https://img.shields.io/badge/backend-huggingface-blue)](https://Prathip2826-vanguard-ai-backend.hf.space)
[![License](https://img.shields.io/badge/license-MIT-purple)](LICENSE)

## 🌟 Overview

VANGUARD AI is an AI-powered enterprise protection platform that provides:

- 🔐 **Digital Asset Protection** - AES-256 encryption for sensitive data
- ⚡ **Rapid Crisis Response** - Real-time supply chain disruption detection
- 📦 **Smart Supply Chains** - Supplier tracking with Google Maps
- 🎯 **Unbiased AI Decisions** - Transparent, explainable AI
- 📊 **Smart Resource Allocation** - Optimized distribution algorithms

## 🚀 Live Demo

- **Frontend:** https://vanguard-ai-12bac.web.app
- **Backend API:** https://Prathip2826-vanguard-ai-backend.hf.space

## 🏗️ Architecture
```text
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│     Next.js     │────▶│   Hugging Face  │────▶│    Firebase     │
│    Frontend     │      │     Backend     │      │    (Auth/DB)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, Tailwind CSS, Firebase Auth |
| Backend | FastAPI, Python, Hugging Face Spaces |
| Database | Firestore |
| AI | Google Gemini API |
| Deployment | Firebase Hosting, Hugging Face |

## 📁 Project Structure
```text
vanguard-ai/
├── vanguard-ai-frontend/       # Next.js application
│   ├── app/                    # App router pages
│   ├── components/             # React components
│   ├── lib/                    # API utilities
│   └── public/                 # Static assets
└── vanguard-ai-backend/        # FastAPI application
    ├── app.py                  # Main API endpoints
    ├── Dockerfile              # Hugging Face deployment
    └── requirements.txt        # Python dependencies
```
