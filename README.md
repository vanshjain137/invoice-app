# 📊 Invoice Management Dashboard

A comprehensive React-based web application for managing business invoices, tracking monthly collections, and generating PDF reports. Built with **React**, **Firebase**, and **Chart.js**.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

* **User Authentication**: Secure Login and Registration using Firebase Auth.
* **Dashboard Overview**: 
    * Visual analytics with Bar Charts (Chart.js) for monthly collections.
    * Quick view of total revenue, total invoices, and current month's collection.
    * Recent invoices list sorted by date.
* **Invoice Management**:
    * **Create**: Add multiple products, calculate totals automatically, and save to Firestore.
    * **View**: Detailed invoice view with customer and product details.
    * **Delete**: Remove unwanted invoices from the database.
* **PDF Generation**: Convert invoices to PDF and print them directly using `html2canvas` and `jspdf`.
* **Profile Settings**: Update Company Name and Profile Picture (stored via Cloudinary).

## 🛠️ Tech Stack

* **Frontend**: React.js, React Router DOM
* **Database & Auth**: Firebase Firestore, Firebase Authentication
* **Visualization**: Chart.js, React-Chartjs-2
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

src/ ├── assets/ # Static assets (images) ├── component/ │ ├── dashboard/ # Main dashboard views (Home, Invoices, Settings) │ ├── login/ # Login page components │ └── register/ # Registration page components ├── firebase.js # Firebase configuration └── App.js # Main routing configuration


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