<template>
  <div id="app">
    <div class="map">
      <the-modal></the-modal>
      <the-map v-if="showMap"></the-map>
    </div>
    <div class="sidebar">
      <the-sidebar @mapToggle="test($event)"></the-sidebar>
    </div>
  </div>
</template>

<script>
import TheModal from './components/TheModal'
import TheSidebar from './components/TheSidebar'
import TheMap from './components/TheMap'

export default {
  name: 'App',
  components: {
    TheModal,
    TheSidebar,
    TheMap
  },
  data() {
    return {
      showMap: true
    }
  },
  methods: {
    test(e) {
      this.showMap = e
    }
  }
}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    flex-direction: row;
  }
  .map {
    flex: 1 0 0;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    min-width: 250px;
  }
</style>
