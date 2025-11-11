<template>
  <v-card v-if="costoFlag">
    <h1>
      OPCIÓN COSTOS
      {{ opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta }}
    </h1>
    <v-form ref="frmDatosOpcion">
      <v-row>
        <v-col cols="3">
          <v-text-field
            type="date"
            v-model="$store.state.pricing.datosPrincipales.fecha_inicio"
            :error-messages="$store.state.pricing.fecha_inicio"
            readonly
            label="Fecha de Registro de Cotización"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            type="date"
            :name="`Fecha Validez de la Opción ${
              opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
            }`"
            :label="`Fecha Validez de la Opción ${
              opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
            }`"
            v-model="
              $store.state.pricing.opcionCostos[$store.state.pricing.page - 1]
                .date_end
            "
            :error-messages="$store.state.pricing.errfecha_fin"
            :rules="[
              (v) => !!v || 'Dato Requerido',
              (v) => isDateValid(v) || 'La fecha debe ser mayor que hoy.',
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            type="number"
            :name="`Tiempo en tránsito de la Opción ${
              opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
            }`"
            :label="`Tiempo en tránsito de la Opción ${
              opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
            }`"
            v-model="
              $store.state.pricing.opcionCostos[$store.state.pricing.page - 1]
                .tiempo_transito
            "
            :error-messages="$store.state.pricing.errtiempo_transito"
            :rules="[
              (v) => !!v || 'Dato Requerido',
              (v) => v > 0 || 'El valor tiene que ser positivo.',
            ]"
          >
          </v-text-field
        ></v-col>
        <v-col cols="3">
          <v-btn
            color="#3363A2"
            class="mx-1 btn-ingresarcostos"
            x-large
            dark
            @click="agregarNuevaOpcion()"
            v-if="
              $store.state.pricing.page ==
              $store.state.pricing.opcionCostos.length
            "
          >
            AGREGAR NUEVA OPCIÓN
            {{ $store.state.pricing.index + 1 }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="12" class="derecha">
        <template>
          <div class="text-center">
            <v-pagination
              v-model="$store.state.pricing.page"
              :length="
                $store.state.pricing.opcionCostos.filter((v) => v.selected)
                  .length
              "
              circle
              class="paginate"
            ></v-pagination>
          </div>
        </template>
      </v-col>
      <v-col cols="12" lg="6" xl="6">
        <CostosComponent
          :valores="
            opcionesSeleccionadas[
              $store.state.pricing.page - 1
            ].listCostos.filter((v) => v.esopcionflag == 1)
          "
          :actualizarCostosFlag="$store.state.pricing.actualizarCostosFlag"
          :amount="$store.state.pricing.datosPrincipales.amount"
          :index="page"
        />
      </v-col>
      <v-col cols="12" lg="6" xl="6">
        <VentasComponent
          :valores="
            opcionesSeleccionadas[
              $store.state.pricing.page - 1
            ].listCostos.filter((v) => v.esventaflag == 1)
          "
          :amount="$store.state.pricing.datosPrincipales.amount"
        />
      </v-col>
      <v-col cols="6" v-if="getExisteImpuesto()">
        <center><h3>Impuestos de Aduana</h3></center>
        <ImpuestosComponent
          v-if="mostrarImpuestos()"
          :amount="$store.state.pricing.datosPrincipales.amount"
          :index="
            opcionesSeleccionadas[$store.state.pricing.page - 1].nro_propuesta
          "
          :impuestos="
            $store.state.pricing.opcionCostos.filter((v) => v.selected)[
              $store.state.pricing.page - 1
            ].listImpuestos
          "
        />
      </v-col>
      <v-col cols="12">
        <v-col class="derecha">
          <v-btn color="success" @click="$store.state.pricing.tab = 4">
            CONTINUAR
          </v-btn>
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from "moment";
// import Swal from "sweetalert2";
export default {
  data() {
    return {
      costoFlag: true,
      page: 1,
      opcionesSeleccionadas: [],
    };
  },
  mounted() {
    this.opcionesSeleccionadas = this.$store.state.pricing.opcionCostos.filter(
      (v) => !!v.selected
    );
  },
  components: {
    CostosComponent: () => import("./Costos/CostosComponent.vue"),
    VentasComponent: () => import("./Costos/VentasComponent.vue"),
    ImpuestosComponent: () => import("./Costos/ImpuestosComponent.vue"),
  },
  methods: {
    mostrarImpuestos() {
      let imp = this.$store.state.pricing.listServices.some(
        (v) => v.codegroupservices == 15 && v.status == true
      );

      return imp;
    },
    agregarNuevaOpcion() {
      if (this.$refs.frmDatosOpcion.validate()) {
        let nro_propuesta = this.$store.state.pricing.index + 1;
        let costos = this.$store.state.pricing.listCostos.map((objeto) => ({
          ...objeto,
          nro_propuesta,
        }));
        let listImpuestos = this.$store.state.pricing.listImpuestos.map(
          (objeto) => ({
            ...objeto,
            nro_propuesta,
          })
        );
        let listNotasQuote = this.$store.state.pricing.listNotasQuote.map(
          (objeto) => ({
            ...objeto,
            nro_propuesta,
          })
        );
        this.$store.state.pricing.opcionCostos.push({
          id: null,
          nro_propuesta: this.$store.state.pricing.index + 1,
          date_end: "",
          tiempo_transito: 0,
          listCostos: costos,
          listImpuestos: listImpuestos,
          listNotasQuote: listNotasQuote,
          selected: true,
        });
        this.$store.state.pricing.index =
          parseInt(this.$store.state.pricing.index) + 1;
        this.mostrarCostos = false;
        this.btnIngresarCostos = true;
        this.$store.state.pricing.actualizarNotas =
          !this.$store.state.pricing.actualizarNotas;
        this.$store.state.pricing.actualizarComparativa =
          !this.$store.state.pricing.actualizarComparativa;
        this.opcionesSeleccionadas =
          this.$store.state.pricing.opcionCostos.filter((v) => !!v.selected);
        this.page = this.page + 1;
        this.$store.state.pricing.actualizarNotas =
          !this.$store.state.pricing.actualizarNotas;
      }
    },
    isDateValid(date) {
      if (!date) {
        return true; // Pasa la validación si el campo está vacío
      }

      const selectedDate = moment(date, "YYYY-MM-DD", true);
      const today = moment();

      return selectedDate.isAfter(today);
    },
    getExisteImpuesto() {
      return this.$store.state.pricing.listServices.some(
        (v) => v.codegroupservices == "15" || v.codegroupservices == 15
      );
    },
  },
  computed: {
    actualizarCostos() {
      return this.$store.state.pricing.costoflag;
    },
    reCalcularOpciones() {
      return this.$store.state.pricing.reCalcularOpciones;
    },
  },
  watch: {
    actualizarCostos() {
      this.costoFlag = false;
      this.costoFlag = true;
    },
    reCalcularOpciones() {
      if (this.$store.state.pricing.tab != 0) {
        console.log(this.costoFlag);

        this.opcionesSeleccionadas = [];
        this.opcionesSeleccionadas =
          this.$store.state.pricing.opcionCostos.filter((v) => !!v.selected);
        this.actualizarCostosFlag = !this.actualizarCostosFlag;
        this.costoFlag = !this.costoFlag;
        setTimeout(() => {
          this.costoFlag = !this.costoFlag;
        }, 10);
      }
    },
  },
};
</script>
<style scoped>
.derecha {
  text-align: right !important;
  align-content: right !important;
}
.v-btn.v-size--x-large {
  font-size: 1.5rem !important;
}
</style>
