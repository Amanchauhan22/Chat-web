import { initializeApp } from "firebase/app";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  getAuth, 
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, setDoc, doc, query, where, getDoc, getDocs, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDZpriqULJo5gszVEfR2oN2flrJ5M0BQtw",
  authDomain: "chat-app-gs-dda87.firebaseapp.com",
  projectId: "chat-app-gs-dda87",
  storageBucket: "chat-app-gs-dda87.appspot.com",
  messagingSenderId: "158073750013",
  appId: "1:158073750013:web:711c55e65f1c5462759994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// 🔹 SIGNUP FUNCTION
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, there I am using chat app",
      lastSeen: Date.now()
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    });

    toast.success("Account created successfully");

  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};


// 🔹 LOGIN FUNCTION (ADDED)
const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful");
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

const logout = async() =>{
 try{
  await signOut(auth)
 }catch(error){
   console.error(error);
   toast.error(error.code.split('/')[1].split('-').join(" "));
 }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error("Enter your email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent");
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

export { signup, loginUser ,logout,auth,db,resetPass};