<template>
  <div>
    <v-stepper v-model="$store.state.entities.stepper" non-linear>
      <v-stepper-header>
        <v-stepper-step
          editable
          step="1"
          :rules="[() => $store.state.entities.isStep1Valid]"
          >Datos del Cliente</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="2"
          :rules="[() => $store.state.entities.isStep2Valid]"
          >Teléfonos y Contactos</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="3"
          :rules="[() => $store.state.entities.isStep3Valid]"
          >Convenios y Tarifas</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="4"
          :rules="[() => $store.state.entities.isStep4Valid]"
          >Información Bancaria</v-stepper-step
        >

        <v-divider></v-divider>

        <v-stepper-step editable step="5">Shipper</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step editable step="6">Destinatario</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!--DATOS DEL CLIENTE-->
        <v-stepper-content step="1">
          <SeccionCliente />
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

        <!--SHIPPER-->
        <v-stepper-content step="5">
          <SeccionShippers />
        </v-stepper-content>

        <!--INFORMACIÓN DE ENTREGA-->
        <v-stepper-content step="6">
          <SeccionInformacionEntrega />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
import SeccionCliente from "./seccionCliente.vue";
import SeccionTelefonos from "./seccionTelefonos.vue";
import SeccionConvenios from "./seccionConvenios.vue";
import SeccionInformacionBancaria from "./seccionInformacionBancaria.vue";
import SeccionShippers from "./seccionShippers.vue";
import SeccionInformacionEntrega from "./seccionInformacionEntrega.vue";
export default {
  components: {
    SeccionCliente,
    SeccionTelefonos,
    SeccionConvenios,
    SeccionInformacionBancaria,
    SeccionShippers,
    SeccionInformacionEntrega,
  },
  data() {
    return {
      loading: false,
      titleVal: "",
      defaultTipoTransaccion: 56,
    };
  },
  computed: {},
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
      "verCliente",
    ]),
  },
  created() {
    this.$store.state.entities.lstProveedores_x_nombre = [];
    this.$store.state.entities.lstProveedores_x_documento = [];
  },
  async mounted() {
    this.$store.state.spiner = true;
    //this.$refs.formProveedor.reset();
    await this._getDocumentsPais();
    await this.cargarMasterDetalleTipoProveedor();
    await this._getPais();
    await this.cargarMasterDetalleTipoTransaccion();
    await this.cargarTipoTelefono();
    await this._getRole();
    await this.getCoinsListCargar();
    await this.getBanksListCargar();
    await this._getSex();
    await this.cargarTipoPersona();
    await this._getProveedorRolShipper();
    await this.verCliente();
    await this._getState(this.$store.state.entities.cliente.id_pais);
    await this._getCity(
      this.$store.state.entities.informacionEntrega.id_departamento
    );
    await this._getTown(
      this.$store.state.entities.informacionEntrega.id_provincia
    );
    this.$store.state.spiner = false;

    this.$store.state.entities.stepper = 1;
    this.$store.state.entities.isEdit = true;
    this.$store.state.entities.isReadonly = false;
    this.$store.state.entities.showBtnSaveFlag = true;

    this.$store.state.mainTitle = `MODIFICAR CLIENTE: CLI`;
  },
  afterMount() {},
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
