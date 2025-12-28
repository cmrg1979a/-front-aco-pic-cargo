<template>
  <v-container>
    <v-col cols="12">
      <center>
        <v-btn
          :class="opcionCalculadora == opcion.id ? 'Active' : 'Inactive'"
          v-for="(opcion, index) in opciones"
          :key="index"
          class="mx-1"
          small
          @click="opcionCalculadora = opcion.id"
        >
          {{ opcion.nombre }}
        </v-btn>
      </center>
    </v-col>
    <v-row>
      <v-col cols="12" style="text-align: right">
        <v-btn color="success" small @click="abrirModalNuevo">Nuevo</v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="obtenerValoresTransportePorOpcion"
        >
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialognNuevo" persistent max-width="30%">
      <v-card>
        <v-card-title> Nuevo Costo Transporte </v-card-title>
        <v-card-text>
          <v-form ref="frmNuevo">
            <v-autocomplete
              :items="$store.state.calculadoras.lstDepartamentos"
              label="Departamento"
              placeholder="Departamento"
              item-value="id"
              item-text="name"
              v-model="id_state"
              @change="cargarDistritos"
              :rules="[(v) => !!v || 'Dato Requerido']"
            ></v-autocomplete>

            <v-autocomplete
              :disabled="!id_state"
              :items="$store.state.calculadoras.lstDistritos"
              label="Distrito"
              placeholder="Distrito"
              item-value="id"
              item-text="name"
              :loading="loading"
              v-model="id_town"
              :rules="[(v) => !!v || 'Dato Requerido']"
            ></v-autocomplete>

            <v-text-field
              v-model="monto"
              label="Monto"
              type="number"
              step="0.001"
              :rules="[(v) => (!!v && v > 0) || 'Dato Requerido']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardar" small>Guardar</v-btn>
          <v-btn color="error" small @click="dialognNuevo = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      id_state: null,
      monto: 0,
      dialognNuevo: false,
      loading: false,
      items: [],
      id_town: 0,
      headers: [
        { value: "departamento", text: "Departamento" },
        { value: "distrito", text: "Distrito" },
        { value: "monto", text: "Monto" },
      ],
    };
  },
  methods: {
    ...mapActions(["getDistritos", "getTransporteGuardar", "getProfitList"]),

    async cargarDistritos() {
      this.loading = true;
      await this.getDistritos({
        id_state: this.id_state,
      });
      this.loading = false;
    },
    abrirModalNuevo() {
      this.dialognNuevo = true;
      this.$nextTick(() => {
        this.$refs.frmNuevo.reset();
      });
    },
    async guardar() {
      let data = {
        shimpent: "LCL",
        id_modality: 1,
      };
      if (this.$refs.frmNuevo.validate()) {
        await this.getTransporteGuardar({
          id_town: this.id_town,
          monto: this.monto,
          opcion: this.$store.state.calculadoras.opcionCalculadora,
        });
        this.dialognNuevo = false;
      }
    },
  },
  computed: {
    opcionCalculadora: {
      get() {
        return this.$store.state.calculadoras.opcionCalculadora;
      },
      set(value) {
        this.$store.commit("setOpcion", value); // o una mutation/action de Vuex
      },
    },
    obtenerValoresTransportePorOpcion() {
      return this.$store.state.calculadoras.lstTransporte.filter(
        (v) => v.opcion == this.opcionCalculadora
      );
    },
    opciones: {
      get() {
        return this.$store.state.calculadoras.opciones;
      },
      set(value) {
        this.$store.commit("setOpcion", value); // o una mutation/action de Vuex
      },
    },
  },
};
</script>
