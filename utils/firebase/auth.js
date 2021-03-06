import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import firebase from './firebase';
import { createProfile, createUser, getMessages, getProfile } from './db';

const authContext = createContext(undefined);

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageData, setMessageData] = useState({})

  const handleUser = async (rawUser) => {
    if (rawUser) {
      let user = await formatUser(rawUser);
      const messData = await getMessages(user.uid);
      const oldUser = await getProfile(user.uid);
      if (oldUser) {
        const userWithoutToken = oldUser
        

        createUser(user.uid, userWithoutToken);
        setUser(user);
        setMessageData(messData);
        setLoading(false);
        return user;
      }
      const { token, ...userWithoutToken } = user;

      createUser(user.uid, userWithoutToken);
      setUser(user);
      setMessageData(messData);
      setLoading(false);
      return user;

    } else {
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const updateMessages = async () => {
    const messData = await getMessages(user.uid);
    setMessageData(messData);

  }

  const signinWithGitHub = (redirect) => {
    setLoading(true);
    const provider = new firebase.auth.GithubAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        handleUser(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });
  }

  const signinWithFacebook = (redirect) => {
    setLoading(true);
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        handleUser(response.user);

        if (redirect) {
          Router.push(redirect);
        }
      });

  }

  const signinWithGoogle = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
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
    messageData,
    updateMessages,
    signinWithGoogle,
    signinWithGitHub,
    signinWithFacebook,
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