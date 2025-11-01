# 🔥 Firebase Setup Guide - Step by Step

If properties are not getting added and you don't see any collections, follow these steps:

## ✅ Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create database"** button
5. Choose **"Start in test mode"** (we'll update rules later)
6. Select a **location** (choose the closest to your users)
7. Click **"Enable"**

**Important:** The database will be created but collections will be empty. Collections are created automatically when you add the first document.

## ✅ Step 2: Verify Your .env File

Make sure your `.env` file exists in the root directory with:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**To get these values:**
1. Go to Firebase Console
2. Click the gear icon ⚙️ > Project Settings
3. Scroll down to "Your apps"
4. Click on your web app (or click `</>` to add one)
5. Copy all the config values

## ✅ Step 3: Update Firestore Security Rules

1. Go to Firebase Console > Firestore Database > Rules
2. Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any user document, but only update their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Properties are readable by all (public), writable by authenticated users
    match /properties/{propertyId} {
      allow read: if true; // Public read access
      allow create: if request.auth != null; // Authenticated users can create
      allow update, delete: if request.auth != null; // Authenticated users can update/delete
    }

    // Feedbacks can be read by all, but only authenticated users can create
    match /feedbacks/{feedbackId} {
      allow read: if true; // Public read access for reviews
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.rating is int
                    && request.resource.data.rating >= 1
                    && request.resource.data.rating <= 5
                    && request.resource.data.comment is string
                    && request.resource.data.comment.size() > 0;
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }

    // Bookings can be read and written by the user who owns them
    match /bookings/{bookingId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null 
                            && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## ✅ Step 4: Enable Authentication

1. Go to Firebase Console > Authentication
2. Click **"Get started"** if you haven't already
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable it (toggle ON)
6. Click **"Save"**

## ✅ Step 5: Create Your First User

1. Run the app: `npm run dev`
2. Go to http://localhost:5173
3. Click **"Register"**
4. Create an account with email and password

## ✅ Step 6: Make Yourself an Admin

1. Go to Firebase Console > Firestore Database
2. Click on **"users"** collection
3. Find your user document (search by your email)
4. Click on the document
5. Click the edit icon (pencil)
6. Change `role` from `"customer"` to `"admin"`
7. Click **"Update"**

## ✅ Step 7: Verify Firebase Connection

1. Open browser console (F12)
2. Check for any Firebase errors
3. Try adding a property
4. Check the console for detailed error messages

## 🐛 Troubleshooting

### Issue: "Permission denied"
- **Solution:** Make sure you're logged in and Firestore rules are published

### Issue: "Collection not found"
- **Solution:** Collections are created automatically when you add the first document. Just try adding a property.

### Issue: No collections showing in Firebase Console
- **Solution:** Collections appear only after adding the first document. This is normal.

### Issue: "Firebase is unavailable"
- **Solution:** Check your internet connection and `.env` file

### Issue: Properties not adding
- **Solution:** 
  1. Check browser console for errors (F12)
  2. Verify you're logged in
  3. Check Firestore rules are published
  4. Make sure Firestore database is created

## 📝 Quick Test

After setup, try this:
1. Log in as admin
2. Go to "Manage Sample Data"
3. Select one property
4. Click "Add Selected Properties"
5. Check browser console for any errors
6. Check Firebase Console > Firestore > properties collection

If you see errors, they will now be displayed in the UI and browser console with detailed information.

