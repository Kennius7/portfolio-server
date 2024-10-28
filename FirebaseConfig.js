const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// const { getAuth, GoogleAuthProvider } = require("firebase/auth");
// const { getStorage } = require("firebase/storage");




const firebaseConfig = {
    apiKey: "AIzaSyC1P9Klx_Aqa_-bYfS2J-qDlTvlr1CvQtM",
    authDomain: "shosan-landing-page.firebaseapp.com",
    projectId: "shosan-landing-page",
    storageBucket: "shosan-landing-page.appspot.com",
    messagingSenderId: "679519220619",
    appId: "1:679519220619:web:101c2a17510da97003358e",
    measurementId: "G-9QD56KD318"
  };

const app = initializeApp(firebaseConfig);

module.exports.db = getFirestore(app);
// export const storage = getStorage(app);
// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();

