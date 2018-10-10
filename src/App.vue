<template>
  <div id="app">
    <div class="main">
      <marker-modal></marker-modal>
      <login-modal></login-modal>
      <the-map v-if="showMap === true"></the-map>
      <the-table v-if="showMap === false"></the-table>
    </div>
    <div class="sidebar">
      <the-sidebar></the-sidebar>
    </div>
  </div>
</template>

<script>
import MarkerModal from './components/MarkerModal'
import LoginModal from './components/LoginModal'
import TheSidebar from './components/TheSidebar'
import TheMap from './components/TheMap'
import TheTable from './components/TheTable'

export default {
  name: 'App',
  components: {
    MarkerModal,
    LoginModal,
    TheSidebar,
    TheMap,
    TheTable
  },
  computed: {
    showMap() {
      return this.$store.getters.getShowMap
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
  .main {
    flex: 1 0 0;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    min-width: 250px;
  }
</style>
