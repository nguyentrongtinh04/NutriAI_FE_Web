// src/firebase.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKM_BJp7DUKHFtW1tBBS8CnGd08pdHnFA",
  authDomain: "kltn-67a14.firebaseapp.com",
  projectId: "kltn-67a14",
  storageBucket: "kltn-67a14.appspot.com",
  messagingSenderId: "383034214927",
  appId: "1:383034214927:web:7b42ce7d4653c4da88f17a",
  measurementId: "G-DT8VKFP07G"
};

// ✅ Khởi tạo app nếu chưa có
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export default firebase;
