<template>
  <v-card elevation="1">
    <v-card-title primary-title>
      Filtrar Cotización <v-spacer></v-spacer>
      <v-btn
        icon
        color="default"
        @click="
          $store.state.pricing.filtrarQuoteFlag =
            !$store.state.pricing.filtrarQuoteFlag
        "
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form ref="frmFiltro">
        <div class="row mt-3 mx-1">
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listMarketing"
              label="Tipo de Marketing"
              dense
              search
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtro.id_marketing"
            ></v-autocomplete>
          </div>
          <!-- <v-card-text class="mt-3 px-5 py-1"> -->
          <div class="col-12 py-1">
            <v-autocomplete
              auto-select-first
              :items="$store.state.pricing.listQuoteStatus"
              label="Estado de la Cotización"
              dense
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtro.id_status"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listEjecutivo"
              label="Ejecutivo."
              dense
              search
              item-text="name"
              item-value="id_entitie"
              v-model="$store.state.pricing.filtro.id_entities"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listModality"
              label="Sentido"
              v-model="$store.state.pricing.filtro.id_modality"
              dense
              item-text="name"
              item-value="id"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listShipment"
              label="Carga*"
              dense
              item-text="embarque"
              item-value="id"
              v-model="$store.state.pricing.filtro.id_shipment"
            >
            </v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listIncoterms"
              label="Incoterm*"
              dense
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtro.id_incoterm"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-text-field
              v-model="$store.state.pricing.filtro.fechainicio"
              label="Fecha de Registro"
              type="date"
            ></v-text-field>
          </div>
          <div class="col-12 py-1">
            <v-text-field
              v-model="$store.state.pricing.filtro.fechafin"
              label="Fecha de Registro"
              type="date"
            ></v-text-field>
          </div>
          <div class="col-12 py-1">
            <v-radio-group v-model="$store.state.pricing.filtro.estado" column>
              <v-radio label="Activo" color="green" value="activo"></v-radio>
              <v-radio label="Inactivo" color="red" value="eliminado"></v-radio>
              <v-radio label="Todos" color="blue" value="todos"></v-radio
            ></v-radio-group>
          </div>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="mx-1" color="success" @click="filtrar()">Filtrar</v-btn>
      <v-btn class="mx-1" color="default" @click="limpiar()">Limpiar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      "getMarketingList",
      "getModulesEntities",
      "getQuoteStatus",
      "getModality",
      "getShipment",
      "getIncoterms",
      "getListQuote",
    ]),
    async filtrar() {
     
      this.$store.state.spiner = true;
      await this.getListQuote();
      this.$store.state.pricing.filtrarQuoteFlag = false;
      this.$store.state.spiner = false;
    },
    async limpiar() {
      this.$store.state.spiner = true;
      this.$store.state.pricing.filtro.id_marketing = "";
      this.$store.state.pricing.filtro.id_status = "";
      this.$store.state.pricing.filtro.id_entities = "";
      this.$store.state.pricing.filtro.id_modality = "";
      this.$store.state.pricing.filtro.id_shipment = "";
      this.$store.state.pricing.filtro.id_incoterm = "";
      this.$store.state.pricing.filtro.fechainicio = "";
      this.$store.state.pricing.filtro.fechafin = "";
      this.$store.state.pricing.filtro.estado = "activo";
      this.$store.state.pricing.filtro.estado = "activo";
      await this.getListQuote();
      this.$store.state.pricing.filtrarQuoteFlag = false;
      this.$store.state.pricing.filtro.estado = "activo";
      this.$store.state.spiner = false;
    },
  },
  async mounted() {
    await this.getMarketingList();
    await this.getModulesEntities();
    await this.getQuoteStatus();
    await this.getModality();
    await this.getShipment();
    await this.getIncoterms();
  },
};
</script>

<style></style>
