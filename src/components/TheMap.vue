<template>
  <GmapMap
    :center="mapView.center"
    :zoom="mapView.zoom"
    style="height:100%;"
    :map-type-id="mapSettings.type"
    :options="{
      maxZoom: 21,
      minZoom: 2,
      disableDefaultUI: true,
      zoomControl: true,
      styles: mapStyle
    }"
    @center_changed="centerChange"
    @dragend="updateMapCenter"
    @zoom_changed="zoomChange"
  >
    <GmapInfoWindow
      :options="{
        pixelOffset: {
          width: 0,
          height: -35
        }
      }"
      :position="infoWin.pos"
      :opened="infoWin.open"
      @closeclick="$store.commit('closeInfoWin')"
    >
      <h6>{{ infoWin.content.name }}</h6>
      <p class="m-0">{{ infoWin.content.place }}</p>
    </GmapInfoWindow>

    <gmap-custom-marker
      v-for="(viewer) in viewers" :key="viewer.id"
      :marker="{ latitude: viewer.position.lat, longitude: viewer.position.lng}"
      @click.native="clickMarker(viewer)"
      :style="{zIndex: (infoWin.markerID == viewer.id ? 20000 : 10000)}"
    >
      <the-crayon :hue="viewer.hue" height="40" :map="true"></the-crayon>
    </gmap-custom-marker>

    <GmapCluster ref="cluster" :gridSize="4">
      <gmap-marker v-for="v in viewers"
          :position="v.position"
          :key="v.id"
          :visible="false"
          :label="v.id"
          ></gmap-marker>
    </GmapCluster>
  </GmapMap>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import TheCrayon from './TheCrayon'
import * as styles from './../assets/map-styles/index'

export default {
  name: 'TheMap',
  components: {
    GmapCustomMarker,
    TheCrayon
  },
  data() {
    return {
      tempCenter: null,
      tempZoom: null,
      clusterObject: null
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.$refs.cluster.$clusterPromise.then(() => {
        this.clusterObject = this.$refs.cluster.$clusterObject
      })
    })
  },
  watch: {
    'clusterObject.clusters_': {
      handler: function(val) {
        this.$store.commit('updateClusters', val)
      }
    }
  },
  computed: {
    mapView() {
      return this.$store.getters.getMapView
    },
    mapSettings() {
      return this.$store.getters.getMapSettings
    },
    mapStyle() {
      return styles[this.$store.getters.getMapSettings.style]
    },
    viewers() {
      return this.$store.getters.getViewersFilter
    },
    seenViewers() {
      return this.$store.getters.getSeenViewers
    },
    infoWin() {
      return this.$store.getters.getInfoWin
    },
    topZIndex() {
      return this.$store.getters.getTopZIndex
    },
    clusterInfo() {
      return this.$store.getters.getClusterInfo
    }
  },
  methods: {
    clickMarker(viewer) {
      if (!this.seenViewers.includes(viewer.id)) {
        this.$store.commit('markSeenViewer', viewer.id)
      }
      this.$store.commit('openInfoWin', viewer)

      this.tempCenter = viewer.position
      this.tempZoom = 8
      this.updateMapCenter()
      this.zoomChange()
    },
    centerChange(center) {
      this.tempCenter = {
        lat: center.lat(),
        lng: center.lng()
      }
    },
    updateMapCenter() {
      this.$store.commit('updateMapCenter', this.tempCenter)
    },
    zoomChange(zoom) {
      this.$store.commit('updateMapZoom', zoom || this.tempZoom)
    }
  }
}
</script>

<style>
  .cluster {
    visibility: hidden;
  }
</style>
