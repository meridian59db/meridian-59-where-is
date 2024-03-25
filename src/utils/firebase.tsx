// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA_fM0uVNtxQ-h_yA5sQs54r-YN6pXD1yQ',
  authDomain: 'meridian-where-is.firebaseapp.com',
  projectId: 'meridian-where-is',
  storageBucket: 'meridian-where-is.appspot.com',
  messagingSenderId: '823341964290',
  appId: '1:823341964290:web:f2c27ce88dd35b09855b1b',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database
export const db = getFirestore();
