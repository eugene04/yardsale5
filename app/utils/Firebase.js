// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwe4gKF5Udf2L2Nn_SrtTVesB26d6FbbI",
  authDomain: "baracuda-a5d9f.firebaseapp.com",
  databaseURL: "https://baracuda-a5d9f.firebaseio.com",
  projectId: "baracuda-a5d9f",
  storageBucket: "baracuda-a5d9f.appspot.com",
  messagingSenderId: "328142417731",
  appId: "1:328142417731:web:8c41d92bcad854c73a49f6",
  measurementId: "G-7WQPCC7F2F",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
