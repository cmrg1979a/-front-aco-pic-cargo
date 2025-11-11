<template>
  <v-container>
    sss
    <v-dialog
      v-model="dialog"
      persistent
      max-width="70%"
      class="px-5"
      style="background: red !important"
    >
      <v-card class="px-5">
        <v-row>
          <v-col class="pb-0" cols="12"> Nuevo Estado House </v-col>
          <v-col class="py-0" cols="4">
            <v-text-field label="Descripción"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <h4>Modalidad</h4>
            <v-row no-gutters>
              <v-checkbox
                v-for="(modalidad, index) in $store.state.pricing.listModality"
                v-model="modalidad.selected"
                :key="index"
                :label="`${modalidad.name}`"
                row
              ></v-checkbox>
            </v-row>
          </v-col>
          <v-col cols="6"></v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
    };
  },
  // props: {
  //   dialog: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  methods: {
    ...mapActions(["getModality", "getShipment"]),
  },
  mounted() {
    this.getModality();
    this.getShipment();
  },
  watch: {
    dialog() {
      if (this.dialog) {
        console.log("sss");
      }
    },
  },
};
</script>

<style></style>
