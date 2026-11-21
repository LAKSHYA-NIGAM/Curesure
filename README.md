# 💊 CureSure – Modern Online Medicine Store Web App

![CI](https://github.com/LAKSHYA-NIGAM/Curesure/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

CureSure is a responsive, feature-rich e-commerce web application built for browsing, searching, and purchasing pharmaceuticals online. Built with a modern **React 18 + TypeScript** architecture styled with **Tailwind CSS**, featuring pure business logic calculations, real-time cart state management, and prescription requirements tracking.

---

## 🚀 Live Demo
👉 **[CureSure – Visit Site](https://lakshya-curesure.netlify.app)**

---

## ✨ Features

- **🔍 Search & Filter**: Real-time multi-field search across medicine brand names, generic formulations (salts), and categories with dedicated "Rx Only" prescription filter toggle.
- **🛒 Dynamic Cart Engine**: Real-time quantity manipulation, item removal, automatic price discount computation, and automated shipping fee waiver for orders exceeding ₹500.
- **📦 Prescription Flagging**: Clear visual badges marking prescription-controlled pharmaceuticals (`Rx Required`).
- **📱 Fully Responsive**: Fluid, mobile-optimized experience with responsive search drawer and sticky categories navigation.
- **🛡️ 100% Tested Business Logic**: Cart summary, stock clamping, item removal, and catalog filtering verified via zero-dependency native Node unit tests.

---

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert`)
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/LAKSHYA-NIGAM/Curesure.git
cd Curesure
```

### 2. Run Test Suite
```bash
# Execute unit tests for cart calculations, discounts, and filters
npm test
```

### 3. Start Development Server
```bash
npm install
npm run dev
```

---

## 📂 Project Architecture

```
Curesure/
├── .github/workflows/
│   └── ci.yml               # Automated CI test pipeline
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx       # Search, category chips & cart badge
│   │   ├── MedicineCard.tsx # Medicine product card with stock & Rx tag
│   │   └── CartDrawer.tsx   # Slide-over cart breakdown & checkout
│   ├── data/
│   │   └── medicines.ts     # Curated pharmaceutical inventory dataset
│   ├── types/
│   │   └── index.ts         # TypeScript data contracts & interfaces
│   ├── utils/
│   │   ├── cart.ts          # Core cart & discount calculation functions
│   │   └── cart.test.ts     # Unit tests for cart & catalog logic (9 tests)
│   ├── App.tsx              # Application layout & state management
│   ├── main.tsx             # Entrypoint & DOM mounting
│   └── index.css            # Tailwind CSS directives
├── package.json             # Scripts & dependencies
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind theme configuration
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
