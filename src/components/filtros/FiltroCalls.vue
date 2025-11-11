<template>
  <v-card elevation="1">
    <v-card-title primary-title>
      Filtrar LLamadas <v-spacer></v-spacer>
      <v-btn
        icon
        color="default"
        @click="
          $store.state.pricing.filtrarCallsFlag =
            !$store.state.pricing.filtrarCallsFlag
        "
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form ref="frmFiltro">
        <div class="row mt-3 mx-1">
          <!-- <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listMarketing"
              label="Tipo de Marketing"
              dense
              search
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtroCalls.id_marketing"
            ></v-autocomplete>
          </div> -->
          <!-- <v-card-text class="mt-3 px-5 py-1"> -->
          <div class="col-12 py-1">
            <v-autocomplete
              auto-select-first
              :items="$store.state.pricing.listQuoteStatus"
              label="Estado de la Cotización"
              dense
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtroCalls.id_status"
            ></v-autocomplete>
          </div>
          <!-- <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listEjecutivo"
              label="Ejecutivo."
              dense
              search
              item-text="name"
              item-value="id"
              v-model="$store.state.pricing.filtroCalls.id_entities"
            ></v-autocomplete>
          </div> -->
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listModality"
              label="Sentido"
              v-model="$store.state.pricing.filtroCalls.id_modality"
              dense
              item-text="name"
              item-key="id"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listShipment"
              label="Carga*"
              dense
              item-text="embarque"
              item-key="id"
              v-model="$store.state.pricing.filtroCalls.id_shipment"
            >
            </v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-autocomplete
              :items="$store.state.pricing.listIncoterms"
              label="Incoterm*"
              dense
              item-text="name"
              item-key="id"
              v-model="$store.state.pricing.filtroCalls.id_incoterm"
            ></v-autocomplete>
          </div>
          <div class="col-12 py-1">
            <v-text-field
              v-model="$store.state.pricing.filtroCalls.fechainicio"
              type="date"
              label="Fecha de Registro"
            ></v-text-field>
          </div>
          <div class="col-12 py-1">
            <v-text-field
              v-model="$store.state.pricing.filtroCalls.fechafin"
              type="date"
              label="Fecha de Registro"
            ></v-text-field>
          </div>
          <div class="col-12 py-1">
            <v-radio-group
              v-model="$store.state.pricing.filtroCalls.estado"
              column
            >
              <v-radio label="Activo" color="green" value="activo"></v-radio>
              <v-radio
                label="Eliminado"
                color="red"
                value="eliminado"
              ></v-radio>
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
      "getQuoteCall",
    ]),
    async filtrar() {
      this.$store.state.spiner = true;
      await this.getQuoteCall(this.$store.state.pricing.filtroCalls);
      this.$store.state.pricing.filtrarCallsFlag = false;
      this.$store.state.spiner = false;
    },
    async limpiar() {
      this.$store.state.spiner = true;
      this.$refs.frmFiltro.reset();
      await this.getQuoteCall(this.$store.state.pricing.filtroCalls);
      this.$store.state.pricing.filtrarCallsFlag = false;
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
