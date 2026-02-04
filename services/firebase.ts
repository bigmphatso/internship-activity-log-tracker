
import { initializeApp, FirebaseApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    Auth,
    UserCredential,
    User as FirebaseUser
} from "firebase/auth";
import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    Firestore
} from "firebase/firestore";
import { firebaseConfig } from '../firebase-config';
import { Internship, User } from "../types";


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const isConfigValid = () => {
    return firebaseConfig.apiKey && firebaseConfig.projectId;
}

if (isConfigValid()) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
}

export const checkFirebaseConfig = isConfigValid;

// --- Authentication ---

const formatAuthError = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'This email address is already in use.';
        case 'auth/weak-password':
            return 'The password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};


export const signIn = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Firebase not configured");
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(formatAuthError(error.code));
    }
};

export const signUp = async (email: string, password: string): Promise<UserCredential> => {
    if (!auth) throw new Error("Firebase not configured");
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        throw new Error(formatAuthError(error.code));
    }
};

export const signOutUser = async (): Promise<void> => {
    if (!auth) throw new Error("Firebase not configured");
    await signOut(auth);
};

export { auth, db };
