import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZuRj34oekKFU-PIO1fQJNPVju0BzTYQs",
  authDomain: "shandesh-final-web.firebaseapp.com",
  projectId: "shandesh-final-web",
  storageBucket: "shandesh-final-web.appspot.com",
  messagingSenderId: "243843379913",
  appId: "1:243843379913:web:9a6af449d7c0c844d95318",
  measurementId: "G-BXZP8KQQJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
