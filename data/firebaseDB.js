import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm-y-CEZfrtv1hxiFsJza6641WK6JKgUs",
  authDomain: "medical-552fc.firebaseapp.com",
  projectId: "medical-552fc",
  storageBucket: "medical-552fc.appspot.com",
  messagingSenderId: "142229690493",
  appId: "1:142229690493:web:6f9983ae805ecd4b23b914",
  measurementId: "G-5NEPQ7NGGN"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export { firebase };