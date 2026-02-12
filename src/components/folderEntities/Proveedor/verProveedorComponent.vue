<template>
  <div>
    <v-stepper v-model="$store.state.entities.stepper" non-linear>
      <v-stepper-header>
        <v-stepper-step editable step="1">Datos del Proveedor</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable step="2">Teléfonos y Contactos</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable step="3">Convenios y Tarifas</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable step="4">Información Bancaria</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="5">
          Correo para Pedir Tarifa
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!--DATOS DEL PROVEEDOR-->
        <v-stepper-content step="1">
          <SeccionProveedor />
        </v-stepper-content>

        <!--TELÉFONOS-->
        <v-stepper-content step="2">
          <SeccionTelefonos />
        </v-stepper-content>

        <!--CONVENIOS Y TARIFAS-->
        <v-stepper-content step="3">
          <SeccionConvenios />
        </v-stepper-content>

        <!--INFORMACIÓN BANCARIA-->
        <v-stepper-content step="4">
          <SeccionInformacionBancaria />
        </v-stepper-content>

        <!--Sección Tarifas-->

        <v-stepper-content step="5">
          <SeccionEmailTarifa :guardarFlag="false" />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
import SeccionProveedor from "./seccionProveedor.vue";
import SeccionTelefonos from "./seccionTelefonos.vue";
import SeccionConvenios from "./seccionConvenios.vue";
import SeccionInformacionBancaria from "./seccionInformacionBancaria.vue";
import SeccionEmailTarifa from "./SeccionEmailTarifaComponent.vue";
export default {
  components: {
    SeccionProveedor,
    SeccionTelefonos,
    SeccionConvenios,
    SeccionInformacionBancaria,
    SeccionEmailTarifa,
  },
  data() {
    return {
      loading: false,
      titleVal: "",
      defaultTipoTransaccion: 56,
    };
  },
  methods: {
    ...mapActions([
      "getListProveedor",
      "_getDocumentsPais",
      "cargarMasterDetalleTipoProveedor",
      "cargarMasterDetalleTipoTransaccion",
      "_getRole",
      "getValidaRazonSocial",
      "cargarTipoTelefono",
      "getCoinsListCargar",
      "getBanksListCargar",
      "guardarCliente",
      "getValidaDocumentCliente",
      "_getSex",
      "_getPais",
      "_getState",
      "_getCity",
      "_getTown",
      "cargarTipoPersona",
      "_getProveedorRolShipper",
      "_getProveedor",
      "getVerProveedor",
    ]),
    /* CÓDIGO NUEVO */
    getIDTipoTelefono(criterio = "") {
      var vm = this;
      var id = null;

      const tipoTelefonoData =
        vm.$store.state.masterusuarios.lstTipoTelefono.find(
          (v) => v.descripcion.toUpperCase() == criterio.toUpperCase(),
        );
      if (tipoTelefonoData) {
        id = tipoTelefonoData.id;
      }

      return id;
    },
    getIDTipoPersona(criterio = "") {
      var vm = this;
      var id = null;

      const tipoPersonaData =
        vm.$store.state.masterusuarios.lstTipoPersona.find(
          (v) => v.descripcion.toUpperCase() == criterio.toUpperCase(),
        );
      if (tipoPersonaData) {
        id = tipoPersonaData.id;
      }

      return id;
    },
    getIDTipoDocumento(criterio = "") {
      var vm = this;
      var id = null;

      const tipoDocumentoData = vm.$store.state.itemsDocumentsPais.find(
        (v) => v.name.toUpperCase() == criterio.toUpperCase(),
      );
      if (tipoDocumentoData) {
        id = tipoDocumentoData.id;
      }

      return id;
    },
  },
  created() {
    this.$store.state.entities.lstProveedores_x_nombre = [];
    this.$store.state.entities.lstProveedores_x_documento = [];
  },
  async mounted() {
    this.$store.state.spiner = true;
    //this.$refs.formProveedor.reset();
    Promise.all([
      this._getDocumentsPais(),
      this.cargarMasterDetalleTipoProveedor(),
      this._getPais(),
      this.cargarMasterDetalleTipoTransaccion(),
      this.cargarTipoTelefono(),
      this._getRole(),
      this.getCoinsListCargar(),
      this.getBanksListCargar(),
      this._getSex(),
      this.cargarTipoPersona(),
      this._getProveedorRolShipper(),
      this.getVerProveedor(),
    ]);

    await this._getState(this.$store.state.entities.proveedor.id_pais);
    this.$store.state.spiner = false;

    this.$store.state.entities.stepper = 1;
    this.$store.state.entities.isEdit = false;
    this.$store.state.entities.isReadonly = true;

    this.$store.state.mainTitle = `VER PROVEEDOR: PROV - ${this.$store.state.entities.proveedor.correlativo}`;
  },
};
</script>

<style>
.v-stepper__content {
  padding: 24px;
}

.row + .row {
  margin-top: 0;
}

tr.v-data-table__selected {
  background: #ffccab !important;
}
</style>
