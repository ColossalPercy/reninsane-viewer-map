<template>
  <div class="table h-100">
    <b-card class="h-100 rounded-0 border-right-0" no-body>
      <b-card-header class="">
        <h2 class="m-0">Viewers Table</h2>
      </b-card-header>
      <b-card-body class="p-0" style="overflow: auto">
        <b-table hover fixed head-variant="light" :items="viewers" :fields="admin ? adminFields : userFields">
          <template slot="location.address_components.country.long_name" slot-scope="data">
            <div class="d-flex justify-content-between align-items-center">
              {{ data.item.location.address_components.country.long_name }}
              <flag :iso="data.item.location.address_components.country.short_name"/>
            </div>
          </template>
          <template slot="created_at" slot-scope="data">
            {{ data.item.created_at.toDate().toLocaleDateString("en-gb", dateOptions) }}
          </template>
          <template slot="hue" slot-scope="data" class="p-0">
            <div class="color-block" :style="{ backgroundColor: 'hsl(' + data.item.hue + ', 100%, 50%)' }">
              {{ data.item.hue }}
            </div>
          </template>
          <template slot="id" slot-scope="data">
            <b-button size="" variant="danger" @click="deleteViewer(data.item.id)">Delete Viewer</b-button>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'TheTable',
  data() {
    return {
      userFields: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'location.address_components.country.long_name',
          label: 'Country',
          sortable: false
        },
        {
          key: 'location.address_components.continent.long_name',
          label: 'Continent',
          sortable: false
        },
        {
          key: 'created_at',
          sortable: true
        },
        {
          key: 'hue',
          sortable: true,
          tdClass: 'hue-cell'
        }
      ],
      dateOptions: { year: 'numeric', month: 'short', day: 'numeric' }
    }
  },
  computed: {
    viewers() {
      return this.$store.getters.getViewers
    },
    adminFields() {
      let fields = this.userFields
      let admin = {
        key: 'id',
        label: 'Delete',
        sortable: false,
        tdClass: 'delete-cell'
      }
      fields.push(admin)
      return fields
    },
    admin() {
      return this.$store.getters.getAdmin
    }
  },
  methods: {
    deleteViewer(id) {
      this.$store.dispatch('deleteViewer', id)
    }
  }
}
</script>

<style>
  .color-block {
    color: rgba(0, 0, 0, 0);
    padding: 0.75rem;
  }

  .hue-cell {
    padding: 0 !important;
  }
  .delete-cell {
    padding: 0 !important;
    vertical-align: middle !important;
    text-align: center;
  }
</style>
