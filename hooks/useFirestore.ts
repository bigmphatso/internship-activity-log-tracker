
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Internship, User } from '../types';

export const useFirestore = (uid: string | undefined) => {
  const [internship, setInternshipState] = useState<Internship | null>(null);
  const [userProfile, setUserProfileState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If db is not initialized or there's no user UID, do not proceed.
    if (!uid || !db) {
      setLoading(false);
      setInternshipState(null);
      setUserProfileState(null);
      return;
    }

    setLoading(true);

    const internshipDocRef = doc(db, 'internships', uid);
    const userProfileDocRef = doc(db, 'users', uid);

    const internshipUnsub = onSnapshot(internshipDocRef, (docSnap) => {
        setInternshipState(docSnap.exists() ? docSnap.data() as Internship : null);
    }, (err) => {
        console.error("Firestore (internship) error:", err);
        setError(err);
    });

    const userProfileUnsub = onSnapshot(userProfileDocRef, (docSnap) => {
        setUserProfileState(docSnap.exists() ? docSnap.data() as User : null);
        setLoading(false); // Consider loading finished after user profile is fetched
    }, (err) => {
        console.error("Firestore (user) error:", err);
        setError(err);
        setLoading(false);
    });

    return () => {
      internshipUnsub();
      userProfileUnsub();
    };
  }, [uid]);

  const setInternship = useCallback(async (data: Internship | null) => {
    // Check for UID and db initialization before writing.
    if (uid && db) {
      try {
        const docRef = doc(db, 'internships', uid);
        await setDoc(docRef, data);
      } catch (err) {
        console.error("Error writing internship data:", err);
        setError(err instanceof Error ? err : new Error('Failed to save internship data'));
      }
    }
  }, [uid]);

  const setUserProfile = useCallback(async (data: User | null) => {
    // Check for UID and db initialization before writing.
    if (uid && db) {
      try {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, data);
      } catch (err) {
        console.error("Error writing user profile:", err);
        setError(err instanceof Error ? err : new Error('Failed to save user profile'));
      }
    }
  }, [uid]);

  return { internship, userProfile, loading, error, setInternship, setUserProfile };
};
