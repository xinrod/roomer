import firebase from './firebase';


const firestore = firebase.firestore();
export async function createUser(uid, data) {
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

export async function sendMessage(sendUid, message, { uid, name }) {
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