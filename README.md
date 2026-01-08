# 🧾 Modern Invoice Creator

A professional React-based web application for managing business invoices, tracking monthly collections, and generating PDF reports. This project demonstrates full-stack capabilities with **React**, **Firebase**, and **Real-time Data Visualization**.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Live Demo
**View App:** [https://invoice-app-pied-alpha.vercel.app/](https://invoice-app-pied-alpha.vercel.app/)  
*Note: You can use the Guest Login below to explore the dashboard immediately.*

### 🔑 Demo Credentials (For Recruiters)
- **Email:** `demo@example.com`
- **Password:** `password123`

---

## 📸 Project Showcases

### Desktop Experience
<p align="center">
  <img src="./assets/dashboard.png" width="48%" alt="Main Dashboard" />
  <img src="./assets/invoices.png" width="48%" alt="Invoice Filtering" />
</p>
<p align="center">
  <img src="./assets/create-invoice.png" width="48%" alt="Invoice Creation" />
  <img src="./assets/invoice-detail.png" width="48%" alt="Final PDF View" />
</p>

### Mobile Responsiveness
<p align="center">
  <img src="./assets/mobile-dashboard.png" width="30%" alt="Mobile Dashboard" />
  <img src="./assets/mobile-menu.png" width="30%" alt="Mobile Navigation" />
</p>

---

## ✨ Key Features

### 🔍 Advanced Data Management
- **Real-time Search**: Instant filtering of invoices by client name directly on the dashboard.
- **Dynamic Business Logic**: Automated calculation of Subtotals and Grand Totals with **Decimal Tax support** (e.g., 5.5%).
- **CRUD Operations**: Create, View, and Delete invoices with instant Firestore synchronization.

### 📊 Visualization & Reporting
- **Data Analytics**: Interactive "Month-wise Collection" charts using **Recharts**.
- **PDF Generation**: Transform digital invoices into professional, print-ready PDF reports.
- **Profile Management**: Customizable business settings including logo and signature via Cloudinary.

### 📱 Responsive Architecture
- **Adaptive UI**: Optimized layouts for Mobile, Tablet, and Desktop.
- **Smart Navigation**: Custom CSS-powered hamburger menu for mobile users.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, React Router DOM
* **Styling**: Modern CSS3 (Flexbox/Grid), FontAwesome Icons
* **Backend/Database**: Firebase Firestore
* **Authentication**: Firebase Auth
* **Visuals**: Recharts (Data Visualization)
* **Image Hosting**: Cloudinary
* **Deployment:** Vercel
* **Utilities**: 
    * `html2canvas` & `jspdf` (PDF Generation)
    * `Cloudinary` (Image Management)

## 🚀 Getting Started

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn
* A Firebase Project
* A Cloudinary Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/invoice-app.git](https://github.com/your-username/invoice-app.git)
    cd invoice-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
    REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
    ```

4.  **Run the application**
    ```bash
    npm start
    ```

## 📂 Project Structure

```text
src/
├── assets/           # Screenshots and project images
├── component/
│   ├── dashboard/    # Main views (Home, Invoices, NewInvoice, Settings)
│   ├── login/        # Auth components
│   └── register/     # Registration views
├── firebase.js       # Firebase SDK Configuration
└── App.js            # Main routing and navigation logic


## 🛡️ Firestore Rules (Recommended)
Ensure your Firestore rules allow users to only read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}