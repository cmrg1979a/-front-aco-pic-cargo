<template>
  <v-container fluid class="pa-0" v-if="verFlag">
    <PreventUnload :when="hasChanges" />
    <v-card>
      <v-stepper v-model="$store.state.pricing.tab" non-linear>
        <v-stepper-header>
          <v-stepper-step
            :complete="$store.state.pricing.tab > 1"
            step="1"
            :editable="editable1"
          >
            Datos de la Carga
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="$store.state.pricing.tab > 2"
            step="2"
            :editable="editable2"
          >
            Costos de la Cotización
          </v-stepper-step>

          <v-divider></v-divider>
          <v-stepper-step
            step="3"
            :complete="$store.state.pricing.tab > 3"
            :editable="editable3"
          >
            Comparativa
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="$store.state.pricing.tab == 4"
            step="4"
            :editable="editable3"
          >
            Notas de Costos
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="$store.state.pricing.tab == 5" step="5"  :editable="editable4">
            Enviar a Operaciones
          </v-stepper-step>
        </v-stepper-header>
        <!-- DATA -->
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row class="my-1">
              <v-col cols="12" lg="6" xl="6" class="pa-0">
                <DatosPrincipales />
              </v-col>
              <v-col cols="12" lg="6" xl="6" class="pa-0">
                <DatosCarga v-if="$store.state.pricing.step2" />
              </v-col>
              <v-col cols="12">
                <Services v-if="$store.state.pricing.step3" />
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-row class="my-1">
              <v-col cols="12">
                <Costos v-if="costoFlag" />
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="3">
            <Comparativa />
          </v-stepper-content>
          <v-stepper-content step="4">
            <Notas />
          </v-stepper-content>
          <v-stepper-content step="5">
            <Instructivo v-if="instructivoFlag" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import mixins from "../../components/mixins/funciones.js";
import PreventUnload from "vue-prevent-unload";
export default {
  mixins: [mixins],
  name: "VerQuoteView",
  components: {
    PreventUnload,
    DatosPrincipales: () =>
      import(
        "../../components/folderPricing/editComponent/DatosPrincipalesComponent.vue"
      ),
    DatosCarga: () =>
      import(
        "../../components/folderPricing/editComponent/DatosCargaComponent.vue"
      ),
    Services: () =>
      import(
        "../../components/folderPricing/editComponent/ServicesComponent.vue"
      ),
    Costos: () =>
      import(
        "../../components/folderPricing/editComponent/DatosCostosComponent.vue"
      ),
    Comparativa: () =>
      import(
        "@/components/folderPricing/editComponent/ComparativaComponent.vue"
      ),
    Notas: () =>
      import("../../components/folderPricing/editComponent/NotasComponent.vue"),
    Instructivo: () =>
      import(
        "../../components/folderPricing/editComponent/InstructivoComponent.vue"
      ),
  },
  data() {
    return {
      hasChanges: true,

      editable1: true,
      editable2: true,
      editable3: true,
      editable4: true,
      costoFlag: false,
      instructivoFlag: false,
      valores: [],
      verFlag: true,
    };
  },
  methods: {
    ...mapActions([
      "getItemsServicesDetails",
      "getMarketingList",
      "getQuoteStatus",
      "getModulesEntities",
      "getModality",
      "getShipment",
      "getIncoterms",
      "getModuleRole",
      "getCargarMasterDetalleNotasCotizacion",
      "_getEntities",
      "_getRole",
      "getImpuestos",
      "getQuote",
      "getPortBegin",
      "getPortEnd",
      "getMultiplicador",
      "getInstructivoId",
      "getBegEndList",
      "cargarMasterDetallePercepcionAduana",
      "getTipoCostos",
      "cargarProveedores",
      "_getEntitiesCliente",
      "getPersonalPricing",
      "obtenerImpuestoXEmpresa",
      "generaInstructivo",
    ]),
  },
  async mounted() {
    await this.obtenerImpuestoXEmpresa();
    this.$store.state.pricing.actualizarCostosFlag = false;
    this.verFlag = false;
    this.$store.state.pricing.tab = 1;
    this.$store.state.spiner = true;

    await this.getQuote({ id: this.$route.params.id });
    this.$store.state.mainTitle = `EDITAR  COTIZACIÓN - ${this.$store.state.pricing.nro_quote}`;
    await this.getInstructivoId({ id: this.$route.params.id });
    this.valores = this.$store.state.pricing.listCostos.filter(
      (v) => v.esopcionflag == 1
    );
    await this.getMarketingList();
    await this.getQuoteStatus();
    await this.getModulesEntities();
    await this.getModality();
    await this.getShipment();
    await this.getIncoterms();
    await this.getModuleRole();
    await this._getRole();
    await this.getBegEndList();
    await this.cargarMasterDetallePercepcionAduana();
    await this.getTipoCostos();
    await this.cargarProveedores();
    await this._getEntitiesCliente();
    await this.getPersonalPricing();
    await this.getItemsServicesDetails();
    await this.getImpuestos();
    await this.getCargarMasterDetalleNotasCotizacion();
    let idTransporte = this.$store.state.pricing.listShipment.filter(
      (v) => v.id == this.$store.state.pricing.datosPrincipales.idtipocarga
    )[0].id_transport;
    await this.getPortBegin({
      id_transport: idTransporte,
    });
    await this.getPortEnd({
      id_transport: idTransporte,
    });
    this.$store.state.pricing.step2 = true;
    await this.getMultiplicador();
    await this._getEntities();

    this.$store.state.pricing.step3 = true;
    this.costoFlag = true;
    this.$store.state.spiner = false;
    // await this.getImpuestos();
    // await this.getCargarMasterDetalleNotasCotizacion();
    this.verFlag = true;
    this.$store.state.pricing.actualizarCostosFlag =
      !this.$store.state.pricing.actualizarCostosFlag;
    setTimeout(() => {
      this.$store.state.pricing.actualizarCostosFlag =
        !this.$store.state.pricing.actualizarCostosFlag;
    }, 300);
    await setTimeout(() => {
      this.$store.state.pricing.actualizarComparativa =
        !this.$store.state.pricing.actualizarComparativa;
    }, 100);
    this.$store.state.spiner = false;
    this.$store.state.pricing.index =
      this.$store.state.pricing.opcionCostos.length;
    this.$store.state.drawer = false;
    this.$forceUpdate();
    setTimeout(() => {
      this.instructivoFlag = true;
    }, 100);
    await setTimeout(() => {
      this.$store.state.pricing.actualizarComparativa =
        !this.$store.state.pricing.actualizarComparativa;
      this.generaInstructivo();
    }, 100);
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.pricing.tab;
      },
      set(val) {
        return (this.$store.state.pricing.tab = tab);
      },
    },
  },
  watch: {
    tab() {
      this.$store.state.pricing.actualizarComparativa =
        !this.$store.state.pricing.actualizarComparativa;
      this.$store.state.pricing.actualizarNotas =
        !this.$store.state.pricing.actualizarNotas;
    },
  },
};
</script>

<style></style>
