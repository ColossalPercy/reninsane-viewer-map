import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { store } from './store'

firebase.initializeApp({
  apiKey: process.env.GOOGLE_API_KEY,
  projectId: 'reninsane-viewer-1536928769661',
  databaseURL: 'https://reninsane-viewer-1536928769661.firebaseio.com'
})

const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)
let viewers = db.collection('viewers')

// Getting Real time feeds
function feed() {
  viewers
    .orderBy(store ? store.getters.getviewersSort.field : 'name', 'asc')
    .onSnapshot(querySnapshot => {
      const theViewers = []
      querySnapshot.forEach(doc => {
        theViewers.push({ id: doc.id, ...doc.data() })
      })
      store.commit('watchViewers', theViewers)
    })
}

feed()

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.commit('updateAdmin', true)
  } else {
    store.commit('updateAdmin', false)
    // store.commit('hideTable')
  }
})

function login(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(error => {
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        alert('The email or password provided is incorrect.')
      }
    })
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      store.commit('updateAdmin', false)
    })
}

export default {
  addViewer: viewer => {
    return viewers.add({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      ...viewer
    })
  },
  deleteViewer: id => {
    return viewers
      .doc(id)
      .delete()
      .then(function() {
        console.log('Document successfully deleted!')
      })
      .catch(function(error) {
        console.error('Error removing document: ', error)
      })
  },
  newFeedSort: () => {
    feed()
  },
  login,
  logout
}
