<template>
  <b-card class="h-100 rounded-0" no-body >
    <b-card-header class="pl-2">
      <h2 class="m-0 text-nowrap" v-if="showSettings === false">Viewers</h2>
      <h2 class="m-0" v-if="showSettings === true">Settings</h2>
    </b-card-header>

    <b-card-body class="p-0 flex-grow-0" v-if="showSettings === false">
      <b-list-group class="p-2">
        <b-input-group>
          <b-form-input class="filter-input" placeholder="Filter..." v-model="filterText"></b-form-input>
        </b-input-group>
      </b-list-group>
    </b-card-body>
    <b-card-body class="p-0" style="overflow: auto" v-if="showSettings === false">
      <b-list-group class="sidebar-content viewer-list h-100" flush>
        <b-list-group-item
          class="d-flex justify-content-between align-items-center p-1 pl-3"
          :key="viewer.id"
          v-for="viewer in viewers"
          @click="clickMarker(viewer)"
          button
          :variant="!seenViewers.includes(viewer.id) ? 'danger' : 'default'"
        >
          {{ viewer.name }}
          <div class="d-flex mr-1">
            <b-badge class="mr-1" :style="{'visibility': !seenViewers.includes(viewer.id) ? 'visible' : 'hidden'}">NEW</b-badge>
            <!-- <span
              :class="flagClass(viewer.location.address_components.country.short_name)"
              :id="'flag-' + viewer.id"
              v-b-tooltip.hover
            ></span>
            <b-tooltip :target="'flag-' + viewer.id" boundary='window'>
              {{ viewer.location.address_components.country.long_name }}
            </b-tooltip> -->

          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card-body>

    <b-card-body class="p-2" v-if="showSettings === true">
      <b-form>
        <b-form-group
          class="mb-1"
          label="Map Type:"
          label-class="text-nowrap"
        >
          <b-select v-model="mapSettingsType" :options="mapTypes"></b-select>
        </b-form-group>
        <b-form-group
          class="mb-1"
          label="Map Style:"
          label-class="text-nowrap"
        >
          <b-select v-model="mapSettingsStyle" :options="mapStyles"></b-select>
        </b-form-group>
      </b-form>
      <b-button class="d-flex mx-auto" variant="success" @click="markAllSeen">Mark All As Seen</b-button>
      <b-button class="d-flex mx-auto mt-1" v-if="!admin" variant="danger" v-b-modal.adminLogin>Admin Login</b-button>
      <b-button class="d-flex mx-auto mt-1" v-if="admin" variant="danger" @click="adminLogout">Admin Logout</b-button>
    </b-card-body>

    <b-card-footer>
      <div class="d-flex justify-content-between">
        <p class="m-0 font-weight-bold">Viewers: {{ viewers.length }}</p>
        <b-badge class="num-new" v-if="numNew > 0">{{ numNew }} NEW</b-badge>
      </div>
    </b-card-footer>
    <b-card-footer>
      <div class="d-flex">
        <b-btn-group class="mx-auto">
          <b-button variant="primary" :disabled="!showMap" v-b-modal.markerAdd>Add Marker</b-button>
          <b-button variant="info" @click="toggleMap" v-b-tooltip.hover :title="showMap ? 'View Data' : 'View Map'">
            <font-awesome-icon icon="database" v-if="showMap === true" fixed-width />
            <font-awesome-icon icon="map-marked-alt" v-if="showMap === false" fixed-width />
          </b-button>
          <b-button @click="showSettings = !showSettings" v-b-tooltip.hover :title="showSettings ? 'Viewers' : 'Settings'">
            <font-awesome-icon icon="cog" v-if="showSettings === false" fixed-width />
            <font-awesome-icon icon="users" v-if="showSettings === true" fixed-width />
          </b-button>
        </b-btn-group>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
export default {
  name: 'TheSidebar',
  data() {
    return {
      showSettings: false,
      mapTypes: [
        { value: 'roadmap', text: 'Roadmap' },
        { value: 'terrain', text: 'Terrain' },
        { value: 'hybrid', text: 'Hybrid' }
      ],
      mapStyles: [
        { value: null, text: 'Default' },
        { value: 'dark', text: 'Dark' },
        { value: 'grayscale', text: 'Grayscale' },
        { value: 'red', text: 'Red' },
        { value: 'green', text: 'Green' },
        { value: 'blue', text: 'Blue' },
        { value: 'madhouse', text: 'The Madhouse' }

      ],
      sortOptions: {
        Name: 'name',
        Date: 'created_at',
        Country: 'location.address_components.country.long_name',
        Continent: 'location.address_components.continent.long_name'
      }
    }
  },
  methods: {
    clickMarker(viewer) {
      if (!this.seenViewers.includes(viewer.id)) {
        this.$store.commit('markSeenViewer', viewer.id)
      }
      this.$store.commit('openInfoWin', viewer)

      this.$store.commit('updateMapCenter', viewer.position)
      this.$store.commit('updateMapZoom', 8)

      this.$store.commit('increaseZIndex')
    },
    markAllSeen() {
      this.viewers.forEach(viewer => {
        const id = viewer.id
        if (!this.seenViewers.includes(id)) {
          this.$store.commit('markSeenViewer', id)
        }
      })
    },
    toggleMap() {
      this.$store.commit('toggleMap')
    },
    adminLogout() {
      this.$store.dispatch('logout')
    },
    flagClass(iso) {
      return 'flag-icon flag-icon-squared flag-icon-' + iso.toLowerCase()
    }
  },
  computed: {
    viewers() {
      return this.$store.getters.getViewersFilter
    },
    filterText: {
      get() {
        return this.$store.state.viewersFilterText
      },
      set(value) {
        this.$store.commit('closeInfoWin')
        this.$store.commit('updateViewersFilter', value)
      }
    },
    mapSettingsType: {
      get() {
        return this.$store.getters.getMapSettings.type
      },
      set(value) {
        this.$store.commit('updateMapType', value)
      }
    },
    mapSettingsStyle: {
      get() {
        return this.$store.getters.getMapSettings.style
      },
      set(value) {
        this.$store.commit('updateMapStyle', value)
      }
    },
    seenViewers() {
      return this.$store.getters.getSeenViewers
    },
    numNew() {
      let count = 0
      for (let viewer in this.viewers) {
        if (!this.seenViewers.includes(this.viewers[viewer].id)) {
          count++
        }
      }
      return count
    },
    infoWin() {
      return this.$store.getters.getInfoWin
    },
    showMap() {
      return this.$store.getters.getShowMap
    },
    admin() {
      return this.$store.getters.getAdmin
    }
  }
}

</script>

<style>
  .sidebar-content {
    flex: 1 0 0;
    display: block;
    overflow: auto;
  }
  .viewer-list button:hover {
    cursor: pointer;
  }
  .num-new {
    line-height: inherit !important;
  }
  .disabled {
    cursor: not-allowed;
  }
</style>
