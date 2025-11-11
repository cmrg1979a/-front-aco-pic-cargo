<template>
  <v-container fluid class="pa-0">
    <v-card elevation="0" min-height="800">
      <v-card-title primary-title> Datos Principales </v-card-title>
      <v-card-text>
        <v-form class="px-2" ref="form">
          <v-autocomplete
            label="Tipo de Marketing"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listMarketing"
            item-text="name"
            item-value="id"
            v-model="$store.state.pricing.datosPrincipales.id_marketing"
          ></v-autocomplete>
          <v-autocomplete
            label="Estado de la cotización"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listQuoteStatus"
            item-text="name"
            item-value="id"
            v-model="$store.state.pricing.datosPrincipales.id_status"
            :item-disabled="(item) => item.status != 1"
          ></v-autocomplete>
          <v-autocomplete
            label="Ejecutivo"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listEjecutivo"
            item-text="name"
            item-value="id_entitie"
            item-key="id_entitie"
            v-model="$store.state.pricing.datosPrincipales.id_vendedor"
          ></v-autocomplete>

          <v-autocomplete
            label="Pricing"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listEjecutivo"
            item-text="name"
            item-value="id_entitie"
            item-key="id_entitie"
            v-model="$store.state.pricing.datosPrincipales.id_pricing"
          ></v-autocomplete>
          <v-text-field
            label="Nombres"
            outlined
            placeholder="Nombres..."
            :append-icon="'mdi-account-search'"
            @click:append="abrirModalCliente()"
            @click="abrirModalCliente()"
            :rules="[(v) => !!v || 'El nombre es requerido']"
            dense
            requerid
            autocomplete="off"
            id="nombre"
            name="nombre"
            v-model="$store.state.pricing.datosPrincipales.nombre"
            readonly
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            outlined
            placeholder="Teléfono..."
            dense
            readonly
            v-model="$store.state.pricing.datosPrincipales.telefono"
          ></v-text-field>

          <v-autocomplete
            label="Sentido"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listModality"
            item-text="name"
            item-key="id"
            item-value="id"
            v-model="$store.state.pricing.datosPrincipales.idsentido"
            @change="showConfirmationDialog"
          ></v-autocomplete>
          <v-autocomplete
            label="Tipo de Embarque"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="$store.state.pricing.listShipment"
            item-text="embarque"
            item-key="id"
            item-value="id"
            v-model="$store.state.pricing.datosPrincipales.idtipocarga"
            return-object
            @change="showConfirmationDialog"
          ></v-autocomplete>
          <v-autocomplete
            label="Incoterms"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="incoterms()"
            item-text="name"
            item-key="id"
            item-value="id"
            @change="showConfirmationDialog"
            v-model="$store.state.pricing.datosPrincipales.idincoterms"
          >
            <template slot="selection" slot-scope="data">
              {{ data.item.name }} - {{ data.item.description }}
            </template>
          </v-autocomplete>

          <v-text-field
            name="name"
            label="Nombre del proveedor"
            id="id"
            v-model="$store.state.pricing.datosPrincipales.proveedor"
            dense
            outlined
            v-if="mostrarProveedorFlag()"
          ></v-text-field>

          <v-text-field
            name="Teléfono"
            label="Teléfono del proveedor"
            v-model="$store.state.pricing.datosPrincipales.telefonoproveedor"
            dense
            outlined
            v-if="mostrarProveedorFlag()"
            :rules="[
              (v) => {
                if (v === '' || /^\+?\d+$/.test(v)) {
                  return true; // Válido si está en blanco o cumple con el formato
                } else {
                  return 'Formato de teléfono no válido';
                }
              },
            ]"
          ></v-text-field>

          <v-text-field
            name="name"
            label="Dirección del proveedor"
            id="id"
            v-model="$store.state.pricing.datosPrincipales.direccionproveedor"
            dense
            outlined
            v-if="mostrarProveedorFlag()"
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>
    <!-- dIALOG -->
    <v-dialog
      v-model="buscarClienteDialog"
      v-if="buscarClienteDialog"
      :overlay="false"
      max-width="60%"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Buscar Cliente <v-spacer></v-spacer>
          <v-btn color="success" @click="registrarNuevoCliente"
            >Nuevo Cliente</v-btn
          >
        </v-card-title>
        <v-card-text>
          <vRow>
            <vCol cols="12">
              <v-text-field label="Buscar...." v-model="search"></v-text-field>
            </vCol>
            <vCol cols="12">
              <v-data-table
                :headers="headers"
                :items="$store.state.itemsEntities"
                :search="search"
                @dblclick:row="guardarCliente"
                :loading="$store.state.itemsEntities.length == 0"
                item-key="index"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.key }}</td>
                  <td class="text-xs-right">{{ props.item.key }}</td>
                  <td class="text-xs-right">{{ props.item.key }}</td>
                  <td class="text-xs-right">{{ props.item.key }}</td>
                  <td class="text-xs-right">{{ props.item.key }}</td>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-btn
                    small
                    color="success"
                    @click="guardarCliente(null, { item })"
                    >Seleccionar
                    <v-icon dense class="mx-2">mdi-account-plus</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </vCol>
          </vRow>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      buscarClienteDialog: false,
      search: "",
      headers: [
        { text: "Documento", value: "document" },
        { text: "Nombres (s)", value: "namelong" },
        { text: "Teléfono", value: "phone" },
        { value: "action" },
      ],
      registro: this.$store.state.entities.registroFlag,
    };
  },
  name: "DatosPrincipalesComponent",
  //  itemsEntities
  mounted() {},
  methods: {
    ...mapActions([
      "getMarketingList",
      "getQuoteStatus",
      "getModulesEntities",
      "getModality",
      "getShipment",
      "getIncoterms",
      "getPortBegin",
      "getPortEnd",
      "getModuleRole",
      "_getRole",
      "getCargarMasterDetalleNotasCotizacion",
      "_getEntities",
      "getItemsServices",
      "getMultiplicador",
      "getItemsServicesDetails",
      "getImpuestos",
      "getTipoCostos",
      "_getEntitiesCliente",
    ]),
    async abrirModalCliente() {
      this.$store.state.itemsEntities = [];
      this.buscarClienteDialog = true;
      this.$nextTick(() => {
        setTimeout(async () => {
          await this._getEntitiesCliente();
        }, 100);
      });
    },
    async changeShipment() {
      if (this.$store.state.pricing.datosPrincipales.idtipocarga) {
        this.$store.state.spiner = true;

        this.$store.state.spiner = false;
      }
    },
    async aceptar() {
      if (this.$refs.form.validate()) {
        this.$store.state.pricing.step2 = true;
      }
    },
    guardarCliente(e, { item }) {
      if (!item.phone) {
        Swal.fire({
          icon: "warning",
          title: "¡Advertencia!",
          text: "El cliente seleccionado no tiene un número de teléfono registrado. Por favor, seleccione otro cliente o puede actualizar luego en el fichero de cliente.",
        });
      }
      this.$store.state.pricing.datosPrincipales.id_entitie = item.id;
      this.$store.state.pricing.datosPrincipales.nombre = item.namelong;
      this.$store.state.pricing.datosPrincipales.telefono = item.phone;
      this.buscarClienteDialog = false;
    },
    registrarNuevoCliente() {
      this.$store.state.modalEntitie = true;
    },
    mostrarProveedorFlag() {
      let exw = this.$store.state.pricing.listIncoterms.filter(
        (v) =>
          v.id == this.$store.state.pricing.datosPrincipales.idincoterms &&
          v.name == "EXW"
      );

      return exw.length > 0 ? true : false;
    },
    incoterms() {
      let Icoterms = [];
      [...this.$store.state.pricing.listIncoterms].forEach((element) => {
        element.text = element.name + " - " + element.description;
        Icoterms.push(element);
      });
      return Icoterms;
    },
    async showConfirmationDialog() {
      Swal.fire({
        title: "<h1>¿Desea continuar?</h1>",
        html: `<h2>Esta acción borrará todos los costos ingresados en todas las secciones y comenzará desde cero.</h2>
          <br>
          <h2>También puede comenzar una nueva.</h2>`,
        icon: "warning",
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: "<h2>Seguir Editando</h2>",
        showDenyButton: true,
        denyButtonText: "<h2>Nueva Cotización</h2>",
        // showCancelButton: false,
        showCloseButton: true,
        width: 800,
      }).then(async (res) => {
        if (res.isConfirmed) {
          this.$store.state.spiner = true;
          this.$store.state.pricing.listServices = [];
          this.$store.state.pricing.listCostos = [];
          this.$store.state.pricing.listImpuestos = [];
          this.$store.state.pricing.datosPrincipales.containers = [];
          this.$store.state.pricing.datosPrincipales.numerobultos = "";
          this.$store.state.pricing.datosPrincipales.peso = "";
          this.$store.state.pricing.datosPrincipales.volumen = "";
          this.$store.state.spiner = !this.$store.state.spiner;
          let id_transport =
            this.$store.state.pricing.datosPrincipales.idtipocarga
              .id_transport !== undefined
              ? this.$store.state.pricing.datosPrincipales.idtipocarga
                  .id_transport
              : this.$store.state.pricing.listShipment.filter(
                  (v) =>
                    v.id ==
                    this.$store.state.pricing.datosPrincipales.idtipocarga
                )[0].id_transport;

          await this.getPortBegin({
            id_transport: id_transport,
          });
          await this.getPortEnd({
            id_transport: id_transport,
          });
          this.$store.state.spiner = !this.$store.state.spiner;
          await this.getMultiplicador();
          await this.getImpuestos();
          await this.getItemsServices();
          await this.getTipoCostos();
          this.$store.state.pricing.copy_quote.servicios =
            this.$store.state.pricing.listServices;

          await this.getItemsServicesDetails();

          let nro_propuesta = 1;
          this.$store.state.pricing.opcionCostos = [
            {
              nro_propuesta: 1,
              date_end: "",
              tiempo_transito: 0,
              listCostos: [],
              listImpuestos: [],
              listNotasQuote: [],
              selected: false,
            },
          ];
          this.$store.state.pricing.opcionCostos[0].nro_propuesta = 1;
          this.$store.state.pricing.opcionCostos[0].date_end = "";
          this.$store.state.pricing.opcionCostos[0].tiempo_transito = 0;
          this.$store.state.pricing.opcionCostos[0].listCostos =
            this.$store.state.pricing.listCostos.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          this.$store.state.pricing.opcionCostos[0].listImpuestos =
            this.$store.state.pricing.listImpuestos.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          this.$store.state.pricing.opcionCostos[0].listNotasQuote =
            this.$store.state.pricing.listNotasQuote.map((objeto) => ({
              ...objeto,
              nro_propuesta,
            }));
          // console.log(this.$store.state.pricing.opcionCostos[0]);
          this.$store.state.spiner = false;
        }
        if (res.isDismissed) {
          this.$store.state.pricing.copy_quote.idsentido;
          this.$store.state.pricing.datosPrincipales.idtipocarga =
            this.$store.state.pricing.copy_quote.idtipocarga;
          this.$store.state.pricing.datosPrincipales.idincoterms =
            this.$store.state.pricing.datosPrincipales.idsentido =
              this.$store.state.pricing.copy_quote.idincoterms;
        }
        if (res.isDenied) {
          this.$router.push({
            name: "newQuote",
          });
        }
      });
    },
  },
  computed: {
    ...mapState(["registroClienteFlag"]),
  },

  watch: {
    async registroClienteFlag() {
      this.$store.state.spiner = true;
      await this._getEntities();
      this.$store.state.spiner = false;
      if (!!this.$store.state.entities.id) {
        let cliente = this.$store.state.itemsEntities.filter(
          (v) => v.id == this.$store.state.entities.id
        )[0];

        this.$store.state.pricing.datosPrincipales.id_entitie = cliente.id;
        this.$store.state.pricing.datosPrincipales.nombre = cliente.namelong;
        this.$store.state.pricing.datosPrincipales.telefono = cliente.phone;
      }
      this.buscarClienteDialog = false;
    },
  },
};
</script>

<style></style>
