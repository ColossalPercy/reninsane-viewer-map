<template>
  <b-modal
    ref="markerAdd"
    id="markerAdd"
    title="Add New Marker"
    v-on:hidden="resetModal"
    hide-footer
    header-bg-variant="light"
  >
    <b-form @submit.prevent="submitMarker" autocomplete=off>
      <b-form-group id="twitchIDInputGroup"
        label="Twitch ID:"
        horizontal
      >
        <b-form-input id="twitchIDInput"
          required
          v-model="addName"
          placeholder="Enter Twitch ID..."
        ></b-form-input>
      </b-form-group>
      <b-form-group id="posInputGroup"
        label="Location:"
        horizontal
      >
        <GmapAutocomplete
          class="form-control place-input"
          :types="['(cities)']"
          @place_changed="setPlace"
          @input.native="changeAutocomplete"

        >
        </GmapAutocomplete>
      </b-form-group>
      <b-form-group id="hueInputGroup"
        label="Hue:"
      ></b-form-group>
      <b-row class="form-row mb-2">
        <b-col class="col-sm-3 col-form-label d-flex justify-content-center align-items-center">
          <the-crayon :hue="addColor.hue" height="200"></the-crayon>
        </b-col>
        <b-col class="col-sm-9 d-flex justify-content-center">
          <color-picker v-model="addColor"></color-picker>
        </b-col>
      </b-row>
      <div class="d-flex flex-row-reverse">
        <b-button class="ml-2" type="submit" variant="primary">Submit</b-button>
        <b-button @click="closeModal">Cancel</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import TheCrayon from './TheCrayon'
import ColorPicker from '@radial-color-picker/vue-color-picker'
import countriesList from 'countries-list'

export default {
  name: 'MarkerModal',
  components: { TheCrayon, ColorPicker },
  data() {
    return {
      addName: '',
      addLat: '',
      addLng: '',
      addLocation: '',
      addColor: {
        hue: Math.floor(Math.random() * 360),
        saturation: 100,
        luminosity: 50,
        alpha: 1
      },
      validPlace: false
    }
  },
  methods: {
    closeModal() {
      this.$refs.markerAdd.hide()
    },
    submitMarker() {
      document.querySelector('.place-input').setCustomValidity('')
      if (!this.validPlace) {
        document.querySelector('.place-input').setCustomValidity('Invalid place! Please use the dropdown to select your location.')
        return
      }

      this.$store.dispatch('addViewer', {
        name: this.addName,
        position: {
          lat: parseFloat(this.addLat),
          lng: parseFloat(this.addLng)
        },
        hue: this.addColor.hue,
        location: this.addLocation
      })

      this.closeModal()
      this.validPlace = false
    },
    resetModal() {
      this.addName = ''
      this.addLat = ''
      this.addLng = ''
      this.addColor.hue = Math.floor(Math.random() * 360)
      this.addLocation = ''
      document.querySelector('.place-input').value = ''
    },
    setPlace(place) {
      let addressComponents = {}
      place.address_components.forEach(comp => {
        addressComponents[comp.types[0]] = {
          long_name: comp.long_name,
          short_name: comp.short_name
        }
      })

      let countryCode = addressComponents.country.short_name
      let continentCode = countriesList.countries[countryCode].continent

      addressComponents.continent = {
        long_name: countriesList.continents[continentCode],
        short_name: continentCode
      }

      this.addLat = place.geometry.location.lat()
      this.addLng = place.geometry.location.lng()
      this.addLocation = {
        name: place.name,
        address_formatted: place.formatted_address,
        address_components: addressComponents
      }

      this.validPlace = true
    },
    changeAutocomplete(value) {
      document.querySelector('.place-input').setCustomValidity('')
      this.validPlace = false
    }
  }
}
</script>
