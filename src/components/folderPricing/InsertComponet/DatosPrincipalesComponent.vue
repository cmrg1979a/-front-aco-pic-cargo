<template>
  <v-container fluid class="pa-0">
    <v-card elevation="0" ref="frmPuerto">
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
          <!-- @click="buscarClienteDialog = true" -->
          <v-text-field
            label="Nombre del cliente"
            outlined
            placeholder="Nombre del cliente"
            :append-icon="'mdi-account-search'"
            @click:append="abrirModalCliente()"
            @click="abrirModalCliente()"
            :rules="[(v) => !!v || 'El nombre es requerido']"
            dense
            required
            autocomplete="off"
            id="nombre"
            name="nombre"
            v-model="$store.state.pricing.datosPrincipales.nombre"
            readonly
            @click:clear="limpiarCampo"
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
            @change="recargarServiciosCostos()"
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
            @change="recargarServiciosCostos()"
            return-object
          ></v-autocomplete>
          <v-autocomplete
            label="Incoterms"
            outlined
            dense
            :rules="[(v) => !!v || 'Dato requerido']"
            class="my-1"
            :items="incoterms()"
            item-text="text"
            item-key="id"
            item-value="id"
            v-model="$store.state.pricing.datosPrincipales.idincoterms"
            @change="recargarServiciosCostos()"
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
            :rules="[
              (v) => {
                if (v === '' || /^\+?\d+$/.test(v)) {
                  return true; // Válido si está en blanco o cumple con el formato
                } else {
                  return 'Formato de teléfono no válido';
                }
              },
            ]"
            v-if="mostrarProveedorFlag()"
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="#3F51B5"
          v-if="mostrarContinuarFlag"
          dark
          @click="aceptar()"
          >Continuar</v-btn
        >
      </v-card-actions>
    </v-card>
    <!-- dIALOG -->
    <v-dialog
      v-model="buscarClienteDialog"
      :overlay="false"
      max-width="80%"
      transition="dialog-transition"
      v-if="buscarClienteDialog"
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
                item-key="index"
                :loading="$store.state.itemsEntities.length == 0"
                loading-text="Buscando Clientes... Un momento por favor"
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
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
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
      mostrarContinuarFlag: true,
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
      "getTipoCostos",
      "getMultiplicador",
      "getItemsServices",
      "getItemsServicesDetails",
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
    async aceptar() {
      if (this.$refs.form.validate()) {
        this.$store.state.spiner = true;
        await this.getPortBegin({
          id_transport: this.$store.state.pricing.datosPrincipales.idtipocarga
            .id_transport
            ? this.$store.state.pricing.datosPrincipales.idtipocarga
                .id_transport
            : this.$store.state.pricing.datosPrincipales.idtipocarga,
        });
        await this.getPortEnd({
          id_transport: this.$store.state.pricing.datosPrincipales.idtipocarga
            .id_transport
            ? this.$store.state.pricing.datosPrincipales.idtipocarga
                .id_transport
            : this.$store.state.pricing.datosPrincipales.idtipocarga,
        });
        await this.getTipoCostos();
        this.$store.state.pricing.copydatosPrincipales = {
          ...this.$store.state.pricing.datosPrincipales,
        };
        this.$store.state.spiner = false;
        this.$store.state.pricing.step2 = true;
        this.mostrarContinuarFlag = false;
        // this.$nextTick(() => {
        //   const frmPuerto = this.$refs.frmPuerto;
        //   frmPuerto.$el.scrollIntoView({ behavior: "smooth", block: "start" });
        // });
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
    async recargarServiciosCostos() {
      if (
        !!this.$store.state.pricing.step2 ||
        !!this.$store.state.pricing.step3
      ) {
        this.$store.state.spiner = !this.$store.state.spiner;
        await this.getPortBegin({
          id_transport: this.$store.state.pricing.datosPrincipales.idtipocarga
            .id_transport
            ? this.$store.state.pricing.datosPrincipales.idtipocarga
                .id_transport
            : this.$store.state.pricing.datosPrincipales.idtipocarga,
        });
        await this.getPortEnd({
          id_transport: this.$store.state.pricing.datosPrincipales.idtipocarga
            .id_transport
            ? this.$store.state.pricing.datosPrincipales.idtipocarga
                .id_transport
            : this.$store.state.pricing.datosPrincipales.idtipocarga,
        });
        this.$store.state.spiner = !this.$store.state.spiner;

        if (
          !this.$store.state.pricing.listPortEnd.some(
            (v) =>
              v.id_port == this.$store.state.pricing.datosPrincipales.idorigen
          )
        ) {
          this.$store.state.pricing.datosPrincipales.idorigen = "";
        }
        if (
          !this.$store.state.pricing.listPortBegin.some(
            (v) =>
              v.id_port == this.$store.state.pricing.datosPrincipales.iddestino
          )
        ) {
          this.$store.state.pricing.datosPrincipales.iddestino = "";
        }
      }
      if (
        (!!this.$store.state.pricing.step2 ||
          !!this.$store.state.pricing.step3) &&
        (this.$store.state.pricing.opcionCostos.some((v) => !!v.date_end) ||
          (!!this.$store.state.pricing.datosPrincipales.idsentido &&
            !!this.$store.state.pricing.datosPrincipales.idtipocarga &&
            !!this.$store.state.pricing.datosPrincipales.idincoterms))
      ) {
        let mensaje = `Se recargarán los Servicios y Costos. ¿Está seguro de continuar?`;
        Swal.fire({
          width: 1000,
          title: "¡Advertencia!",
          html: "<h1>Esta acción borrará los costos ingresados y volverá a mostrarlos desde cero. ¿Está seguro que desea continuar?</h1>",
          icon: "warning",
          allowOutsideClick: false,
          showConfirmButton: true,
          showCancelButton: false,
          showDenyButton: true,
          confirmButtonText: "<h1>SÍ, RECARGAR.</h1>",
          denyButtonText: "<h1>NO</h1>",
          denyButtonColor: "red",
        }).then(async (res) => {
          if (res.isConfirmed) {
            this.$store.state.spiner = true;
            await this.getMultiplicador();
            await this.getTipoCostos();
            if (!!this.$store.state.pricing.step3) {
              await this.getItemsServices();
            }
            if (
              this.$store.state.pricing.opcionCostos.some((v) => !!v.date_end)
            ) {
              await this.getItemsServicesDetails();
            }
            this.$store.state.pricing.copydatosPrincipales = {
              ...this.$store.state.pricing.datosPrincipales,
            };

            this.$store.state.pricing.abrirModalContenedor =
              !this.$store.state.pricing.abrirModalContenedor;
            this.$store.state.spiner = false;
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
            this.$store.state.pricing.reset = !this.$store.state.pricing.reset;
          }
          if (res.isDenied) {
            this.$store.state.pricing.datosPrincipales.idsentido =
              this.$store.state.pricing.copydatosPrincipales.idsentido;
            this.$store.state.pricing.datosPrincipales.idtipocarga =
              this.$store.state.pricing.copydatosPrincipales.idtipocarga;
            this.$store.state.pricing.datosPrincipales.idincoterms =
              this.$store.state.pricing.copydatosPrincipales.idincoterms;
          }
        });
      } else {
        this.$store.state.pricing.copydatosPrincipales = {
          ...this.$store.state.pricing.datosPrincipales,
        };
      }
    },
    limpiarCampo() {
      this.$store.state.pricing.datosPrincipales.telefono = "";
    },
  },
  computed: {
    ...mapState(["registroClienteFlag", ""]),
  },

  watch: {
    async registroClienteFlag() {
      this.$store.state.spiner = true;
      await this._getEntitiesCliente();
      this.$store.state.spiner = false;
      console.log("llegó");
      if (!!this.$store.state.entities.id) {
        let cliente = this.$store.state.itemsEntities.filter(
          (v) => v.id == this.$store.state.entities.id
        )[0];
        console.log("cliente", cliente);
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
