import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import firebase from './firebase';

const authContext = createContext(undefined);
const firestore = firebase.firestore();
async function createUser(uid, data) {
  return await firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}
export async function createProfile(uid, data) {
  return await firestore
    .collection('profiles')
    .doc(uid)
    .set({ uid: uid, ...data }, { merge: true });
}
export async function getProfile(uid) {
  const doc = await firestore
    .collection('profiles')
    .doc(uid)
    .get();
  return doc.data();
}

export async function sendMessage(sendUid, message, {uid, name}) {
  try {
    return await firestore.collection('users').doc(sendUid).collection('messages').add({
      message: message,
      read: false,
      sentBy: name,
      sentByUid: uid,
    })
  } catch (error) {
    return error;
  }
  
}

export async function getProfiles() {

  const query = await firestore.collection('profiles').get();
  const profiles = [];
  query.forEach((doc) => {
    profiles.push(doc.data());
  })
  return profiles

}

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      createUser(user.uid, userWithoutToken);
      setUser(user);
      setLoading(false);
      return user;
    } else {
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const signinWithGoogle = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGoogle,
    signout,
  };
}

const formatUser = async (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};