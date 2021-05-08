import firebase from './firebase';
import axios from 'axios';



const firestore = firebase.firestore();
export async function createUser(uid, data) {
  return await firestore
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}
export async function createProfile(uid, data) {
  let formattedData = {}
  for (const prop in data) {
    if (!(data[prop] == null || data[prop] === "")) {
      formattedData[prop] = data[prop]
    }
  }
  return await firestore
    .collection('profiles')
    .doc(uid)
    .set({ uid: uid, ...formattedData }, { merge: true });
}
export async function getProfile(uid) {
  const doc = await firestore
    .collection('profiles')
    .doc(uid)
    .get();
  return doc.data();
}

export async function readMessage(uid, mid) {
  return await firestore.collection('users').doc(uid).collection('messages').doc(mid).set({
    read: true,
  }, { merge: true })
}

export const addPseudoUsers = async () => {
  const res = await axios.get('https://randomuser.me/api/?nat=us');
  const psuedo = res.data.results[0]
  const user = {
    uid: psuedo.login.uuid,
    email: psuedo.email,
    name: psuedo.name.first + " " + psuedo.name.last,
    pseudo: true,
    photoUrl: psuedo.picture.thumbnail,
  }
  createUser(user.uid, user);
  createProfile(user.uid, {name: user.name, photoUrl: psuedo.picture.thumbnail, pseudo: true})
}

export async function sendMessage(sendUid, message, { uid, name }) {
  try {
    const ref = firestore.collection('users').doc(sendUid).collection('messages').doc()
    const id = ref.id
    return await firestore.collection('users').doc(sendUid).collection('messages').doc(id).set({
      message: message,
      read: false,
      sentBy: name,
      sentByUid: uid,
      mid: id,
    }, { merge: true })
  } catch (error) {
    return error;
  }

}

export async function getMessages(uid) {
  try {
    let query = await firestore.collection('users').doc(uid).collection('messages').get();
    const messages = [];
    let unread = 0
    if (!query.docs.length ) {
      await sendMessage(uid, `Welcome to Roomer! \n 
      This an auto-generated message from Roomer. \n 
      If people message you from the home page, you will see their messages here! \n 
      To get started, we'd recommend finishing up your profile by clicking the "profile" option next to Roomer at the top right of your screen. 
      If you are on a mobile device, click the 3 stacked bars then hit the "profile" option. \n 
      Feel free to check out any other menu options.`, {uid: "WGj2ExOHICTQrsnSsrHQU3Hkd4f1", name: "The Roomer App"});
      query = await firestore.collection('users').doc(uid).collection('messages').get();
    }
    query.forEach((doc) => {
      const data = doc.data()
      messages.push(data);
      if (!data.read) {
        unread++;
      }
    })
    return {messages: messages, unread: unread};
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