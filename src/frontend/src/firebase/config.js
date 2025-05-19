import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    // Your Firebase configuration object goes here
    // You can get this from your Firebase Console
    apiKey: "AIzaSyA5Dmb7TxAKhUB6RvqLOOszo3dCuFRiiKc",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "https://spider-home-782c7-default-rtdb.firebaseio.com",
    projectId: "spider-home-782c7",
    storageBucket: "spider-home-782c7.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:1005397289371:android:6524d8cdcbd6c1dce2d93e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database }; 