# <img src="/public/android-chrome-512x512.png" alt="DropSi Logo" width="30"/> DropSi Vendor Hub

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000?style=flat-square)](https://ui.shadcn.com/)

## 🚀 Overview

DropSi Vendor Hub is a comprehensive dashboard for grocery retailers partnering with DropSi, Chennai's innovative grocery delivery platform. This portal empowers vendors to manage products, track orders, handle inventory, set pricing, and grow their business through a seamless digital interface.

<div align="center">
  <img src="https://img.shields.io/badge/🛒%20Products-Manage-5CB8FF?style=for-the-badge" alt="Products" />
  <img src="https://img.shields.io/badge/📦%20Orders-Track-5CB8FF?style=for-the-badge" alt="Orders" />
  <img src="https://img.shields.io/badge/💰%20Pricing-Optimize-5CB8FF?style=for-the-badge" alt="Pricing" />
  <img src="https://img.shields.io/badge/📊%20Analytics-Grow-5CB8FF?style=for-the-badge" alt="Analytics" />
</div>

## ✨ Features

- **📋 Product Catalog Management**
  - Import products from our standardized catalog
  - Manage inventory and availability
  - Update pricing in real-time
  
- **📦 Order Processing**
  - Accept and fulfill orders
  - Track delivery status
  - Manage customer communication
  
- **🌐 Delivery Zone Management**
  - Configure pincode-based delivery areas
  - Set delivery fees and minimum order values
  
- **💰 Discount & Promotions**
  - Create and manage discount campaigns
  - Set time-limited offers
  - Configure product-specific promotions
  
- **📊 Performance Analytics**
  - Track sales and performance metrics
  - Visualize business growth
  - Analyze customer behavior

## 🛠️ Tech Stack

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="50" height="50" alt="React" title="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="50" height="50" alt="TypeScript" title="TypeScript" />
  <img src="https://github.com/devicons/devicon/tree/v2.16.0/icons/tailwindcss/tailwindcss-plain.svg" width="50" height="50" alt="Tailwind CSS" title="Tailwind CSS" />
  <img src="https://vitejs.dev/logo.svg" width="50" height="50" alt="Vite" title="Vite" />
</div>

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Build Tool:** Vite
- **State Management:** React Context API
- **Routing:** React Router
- **Authentication:** JWT-based auth flow
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dropsi-vendor-hub.git

# Navigate to project directory
cd dropsi-vendor-hub

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Start the development server
npm run dev
# or
yarn dev
# or
bun dev
```

Visit `http://localhost:5173` to see the application in action.

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_AUTH_TOKEN_KEY=your_auth_token_key
```

## 📂 Project Structure

```
dropsi-vendor-hub/
├── public/               # Public assets
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/           # UI components from shadcn
│   │   └── vendor/       # Vendor-specific components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions and services
│   │   └── services/     # API services
│   ├── pages/            # Application pages
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
└── ...config files
```

## 🔄 Workflow

1. **Vendor Authentication:** Secure login and registration process
2. **Product Selection:** Choose products from standardized catalog
3. **Pricing Configuration:** Set competitive pricing and inventory
4. **Order Management:** Process and fulfill customer orders
5. **Analytics Review:** Monitor performance metrics and growth

## 🚢 Deployment

The application is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any queries regarding this project, please reach out to:

- **Website:** [dropsi.in](https://dropsi.in)
- **Email:** partners@dropsi.in

---

<div align="center">
  <p>Built with ❤️ for DropSi partners in Chennai</p>
  <img src="/public/android-chrome-192x192.png" alt="DropSi Logo" width="60"/>
</div>
