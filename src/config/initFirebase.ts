import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCEizaoBiKxRYWLjJii7HM_kzwS6PWIF3U",
    authDomain: "bunker-61ae8.firebaseapp.com",
    projectId: "bunker-61ae8",
    storageBucket: "bunker-61ae8.firebasestorage.app",
    messagingSenderId: "962665992984",
    appId: "1:962665992984:web:3368e92d5df1453b4fc46d",
    measurementId: "G-T427Y56JVF",
    databaseURL: "https://bunker-61ae8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);