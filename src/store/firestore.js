import firebase from 'firebase/app'
import 'firebase/firestore'
import { store } from './store'

firebase.initializeApp({
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

export default {
  addViewer: viewer => {
    return viewers.add({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      ...viewer
    })
  },
  newFeedSort: () => {
    feed()
  }
}
