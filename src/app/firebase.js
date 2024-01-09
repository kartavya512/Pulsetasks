import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAp_vPG1t3JTVmwsS6HrguHcX3Z3HMVELk",
  authDomain: "todo-4a546.firebaseapp.com",
  projectId: "todo-4a546",
  storageBucket: "todo-4a546.appspot.com",
  messagingSenderId: "749000986597",
  appId: "1:749000986597:web:b93a10331e46511c1f690c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
