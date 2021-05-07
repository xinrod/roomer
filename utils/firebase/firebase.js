import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics'
import 'firebase/firestore';


const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  sotrageBucket: "roomer-f8725.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}


export default firebase;
