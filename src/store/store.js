import Vue from 'vue'
import Vuex from 'vuex'
import firestore from './firestore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state: {
    viewers: [],
    viewersFilterText: '',
    viewersSort: {
      type: 'Name',
      field: 'name'
    },
    seenViewers: localStorage.seenViewers
      ? JSON.parse(localStorage.seenViewers)
      : [],
    mapView: {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 2
    },
    mapSettings: {
      type: localStorage.mapType || 'terrain',
      style: localStorage.mapStyle || 'null'
    },
    infoWin: {
      open: false,
      pos: null,
      content: {
        name: '',
        place: ''
      },
      markerID: ''
    },
    topZIndex: 20000,
    clusters: '',
    clusteredMarkers: {},
    clusterInfo: {
      isClustered: false,
      clusterID: null,
      nextInCluster: null,
      prevInCluster: null
    }
  },
  mutations: {
    watchViewers(state, viewers) {
      state.viewers = viewers
    },
    updateViewersFilter(state, filter) {
      state.viewersFilterText = filter
    },
    changeviewersSort(state, sortBy) {
      state.viewersSort = sortBy
      firestore.newFeedSort()
    },
    markSeenViewer(state, id) {
      state.seenViewers.push(id)
      localStorage.seenViewers = JSON.stringify(state.seenViewers)
    },
    updateMapCenter(state, center) {
      state.mapView.center = center
    },
    updateMapZoom(state, zoom) {
      state.mapView.zoom = zoom
    },
    updateMapType(state, type) {
      state.mapSettings.type = type
      localStorage.mapType = type
    },
    updateMapStyle(state, style) {
      state.mapSettings.style = style
      localStorage.mapStyle = style
    },
    openInfoWin(state, viewer) {
      state.infoWin = {
        open: true,
        pos: viewer.position,
        content: {
          name: viewer.name,
          place: viewer.location.address_formatted
        },
        markerID: viewer.id
      }

      if (
        state.infoWin.open === true &&
        state.clusteredMarkers.hasOwnProperty(state.infoWin.markerID)
      ) {
        state.clusterInfo = {
          isClustered: true,
          clusterID: state.clusteredMarkers[state.infoWin.markerID],
          nextInCluster: '',
          prevInCluster: ''
        }
      } else {
        state.clusterInfo = {
          isClustered: false,
          clusterID: null,
          nextInCluster: null,
          prevInCluster: null
        }
      }
    },
    closeInfoWin(state) {
      state.infoWin = {
        open: false,
        pos: null,
        content: {
          name: '',
          place: ''
        },
        markerID: ''
      }
      state.clusterInfo = {
        isClustered: null,
        clusterID: null,
        nextInCluster: null,
        prevInCluster: null
      }
    },
    increaseZIndex(state) {
      state.topZIndex++
    },
    updateClusters(state, clusterObject) {
      let clusters = clusterObject
        .filter(cluster => cluster.markers_.length > 1)
        .map(cluster => cluster.markers_.map(marker => marker.label))
      state.clusters = clusters

      let clusteredMarkers = {}
      for (let cluster in clusters) {
        for (let marker in clusters[cluster]) {
          let id = clusters[cluster][marker]
          clusteredMarkers[id] = cluster
        }
      }
      state.clusteredMarkers = clusteredMarkers

      if (
        state.infoWin.open === true &&
        state.clusteredMarkers.hasOwnProperty(state.infoWin.markerID)
      ) {
        state.clusterInfo = {
          isClustered: true,
          clusterID: state.clusteredMarkers[state.infoWin.markerID],
          nextInCluster: '',
          prevInCluster: ''
        }
      }
    }
  },
  actions: {
    addViewer(state, text) {
      firestore.addViewer(text)
    }
  },
  getters: {
    getViewers: state => {
      return state.viewers
    },
    getViewersFilter: state => {
      return state.viewers.filter(viewer => {
        return viewer.name
          .toLowerCase()
          .includes(state.viewersFilterText.toLowerCase())
      })
    },
    getviewersSort: state => {
      return state.viewersSort
    },
    getSeenViewers: state => {
      return state.seenViewers
    },
    getMapView: state => {
      return state.mapView
    },
    getMapSettings: state => {
      return state.mapSettings
    },
    getInfoWin: state => {
      return state.infoWin
    },
    getTopZIndex: state => {
      return state.topZIndex
    },
    getClusterInfo: state => {
      return state.clusterInfo
    }
  }
})
