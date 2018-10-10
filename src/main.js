// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { store } from './store/store'

import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCog,
  faUsers,
  faDatabase,
  faMapMarkedAlt,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css'

import FlagIcon from 'vue-flag-icon'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_API_KEY,
    libraries: 'places'
  }
})

Vue.component('GmapCluster', GmapCluster)

Vue.use(BootstrapVue)

library.add(
  faCog,
  faUsers,
  faDatabase,
  faMapMarkedAlt,
  faLayerGroup
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(FlagIcon)

// Setup Vue app
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  store,
  template: '<App/>'
})

/* eslint-disable */
