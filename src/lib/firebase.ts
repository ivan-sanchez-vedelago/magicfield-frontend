import { FirebaseApp, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import firebaseConfig from "./firebaseConfig"

const app: FirebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)