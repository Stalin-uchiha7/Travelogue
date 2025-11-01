// Script to add all dummy properties to Firebase
// Run with: node scripts/addPropertiesToFirebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Import Firebase config
const firebaseConfig = {
  // You'll need to add your Firebase config here or import it
  // For now, this will use environment variables or the config from firebase.js
};

// Initialize Firebase (you may need to adjust this based on your setup)
// For now, let's create a simpler approach - using the existing utility function
// But first, let's check if we can import it directly

console.log('This script should be run from the browser console or through the Manage Sample Data page.');
console.log('Alternatively, you can add properties through the admin UI.');

// The easiest way is to use the existing Manage Sample Data page in the UI
// But if you want to add all at once, you can run this in the browser console:

/*
import { addDummyProperties } from './src/utils/addDummyData';
addDummyProperties().then(result => {
  console.log('Added properties:', result);
}).catch(err => {
  console.error('Error:', err);
});
*/

