
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

// LEGACY Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqCuAdKRrTBBL7fiJgxeKrdwff-FIvZGY",
    authDomain: "legacy-b27f7.firebaseapp.com",
    projectId: "legacy-b27f7",
    storageBucket: "legacy-b27f7.firebasestorage.app",
    messagingSenderId: "139713314084",
    appId: "1:139713314084:web:a4243bb9082bdcbf6587b1",
    measurementId: "G-RS7HXHBWYS"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Initialise Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialise Analytics where supported
export let analytics = null;

isSupported()
    .then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    })
    .catch((error) => {
        console.warn("Firebase Analytics unavailable:", error);
    });

// Export the Firebase app
export { app };
