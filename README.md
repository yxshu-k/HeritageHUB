# 🏺 HeritageHUB | Premium Antiquities Marketplace

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> **"Buy History. Sell Legacy. Preserve Heritage."**

HeritageHUB is a state-of-the-art, full-stack marketplace dedicated to the acquisition and preservation of rare antiquities, historical artifacts, and heritage collectibles. Designed with a **"Dark Luxury"** aesthetic, it bridges the gap between historical significance and modern digital commerce.

---

## ✨ Key Features

### 🏛️ Curated Marketplace
- **Historical Context API**: Every artifact is linked to historical data from Wikipedia, providing rich stories and cultural significance (includes a graceful mock fallback system).
- **Heritage Scoring**: A proprietary 1-10 scoring system based on age, rarity, and provenance.
- **Smart Filters**: Advanced categorization (Ancient Coins, Vintage Watches, etc.) with a mobile-optimized collapsible sidebar and multi-layered sorting.

### 🛡️ Authentication & Security
- **Dual-Role Access**: Dedicated flows for **Collectors (Buyers)** and **Custodians (Sellers)**.
- **JWT Protection**: Secure, stateless authentication for all private routes.
- **Admin Governance**: A specialized panel for expert curators to verify artifact authenticity before they enter the public registry.

### 💰 Commerce & Interaction
- **Dynamic Bidding**: Real-time bidding system for rare acquisitions.
- **Wishlist Protocol**: Save and track your most desired historical pieces.
- **Seller Dashboard**: Dedicated management portal for custodians to list inventory, track valuations, and monitor active bids.
- **Cloudinary Integration**: High-resolution media uploads for visual evidence of artifact condition.

### 📱 Responsive Design
- **Mobile-First Luxury**: Fully optimized for all viewports, featuring custom Swiper.js carousels and glassmorphism UI elements.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 3.4 (Custom Typography: Cinzel & Inter)
- **State Management**: React Context API
- **Animations**: Custom Tailwind transitions & Swiper.js for premium sliders

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **File Storage**: Cloudinary API
- **Security**: JSON Web Tokens (JWT) & BCrypt hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account

### 1. Repository Setup
```bash
git clone https://github.com/your-repo/heritagehub.git
cd heritagehub
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=5000
```
Start the API: `npm start`

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the UI: `npm run dev`

---

## 🎨 Design Philosophy: Dark Luxury

HeritageHUB is built on three core aesthetic pillars:
1.  **Vibrant Accents**: Utilizing `#c9a84c` (Heritage Gold) to represent value and history.
2.  **Depth & Layering**: Implementing `backdrop-blur` and deep shadows to create a high-end, gallery-like atmosphere.
3.  **Typography**: Pairing the regal **Cinzel** font for headings with the clean **Inter** font for readability.

---

## 📖 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Crafted with passion by the HeritageHUB Development Team.*
