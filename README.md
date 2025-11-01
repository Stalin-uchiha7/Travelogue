# 🧳 Travelogue – Smart Travel & Hotel Booking Platform

A modern travel booking platform built with React, Material UI, and Firebase that simplifies hotel and accommodation bookings for tourists.

## 🌍 Features

- **User Authentication**: Login, Register, and Logout via Firebase Auth
- **Hotel Listing**: View available properties with filtering by star ratings
- **Property Details**: Detailed view of each property with reviews
- **Review System**: Add and view feedback for properties
- **Responsive Design**: Mobile-first approach using Material UI

## 🧠 Tech Stack

- **Frontend**: React.js with Material UI (MUI)
- **Routing**: React Router DOM
- **Backend/Database**: Firebase (Authentication + Firestore)
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Travelogue
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy your Firebase config

4. Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Initialize Firestore Collections:
   - Create `users` collection
   - Create `properties` collection
   - Create `feedbacks` collection
   - Create `bookings` collection

6. Deploy Firestore Security Rules:
   - Copy the rules from `firestore.rules`
   - Deploy to Firebase Console under Firestore > Rules

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
Travelogue/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── AddFeedbackForm.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PropertiesList.jsx
│   │   └── PropertyDetails.jsx
│   ├── firebase.js
│   ├── App.jsx
│   └── main.jsx
├── firestore.rules
├── .env.example
└── README.md
```

## 🔐 Firebase Collections Structure

### Users
```json
{
  "uid": "auto-generated",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

### Properties
```json
{
  "id": "auto-generated",
  "name": "Taj Palace Hotel",
  "stars": 5,
  "price": 7500,
  "location": "Mumbai",
  "description": "Luxury hotel with sea view.",
  "images": ["url1", "url2"]
}
```

### Feedbacks
```json
{
  "userId": "uid",
  "propertyId": "propertyId",
  "comment": "Great stay and amazing service!",
  "rating": 4.5,
  "timestamp": "2025-10-01T12:00:00Z"
}
```

## 💡 Future Enhancements

- Map integration (Google Maps API)
- Room availability calendar
- Admin dashboard for property management
- Booking payment integration (Razorpay / Stripe)
- Booking management dashboard

## 📝 License

This project is licensed under the MIT License.
