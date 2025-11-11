<template>
  <div>
    <h3>Datos y Servicios a Realizar</h3>
    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field
          readonly
          v-model="$store.state.houses.house.code_master"
          label="N° de Expedientes Master"
        ></v-text-field>
      </v-col>
      <!-- <v-col cols="12" md="4">
        <v-text-field
          readonly
          v-model="$store.state.houses.house.code_house"
          label="N° de Expedientes House"
        ></v-text-field>
      </v-col> -->
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Quote Asociado al House"
          :items="$store.state.pricing.listQuotes"
          item-text="code"
          item-value="id"
          :search-input.sync="searchHouseCotizacion"
          @change="asignarDatos()"
          v-model="$store.state.house_cotizacion"
          clearable
        >
        </v-autocomplete>
        <!-- <v-text-field
          v-model="$store.state.house_cotizacion"
          label="Cotización"
        ></v-text-field> -->
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Modality"
          v-model="$store.state.houses.house.modality"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          readonly
          v-model="$store.state.houses.house.shipment"
          label="Tipo de Embarque"
          return-object
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Incoterms"
          readonly
          v-model="$store.state.houses.house.incoterms"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Origen"
          readonly
          v-model="$store.state.houses.house.port_begin"
          @update:search-input="recargarPuertoOrigen"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Destino"
          readonly
          v-model="$store.state.houses.house.port_end"
          @update:search-input="recargarPuertoDestino"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-dialog v-model="$store.state.modalServices_manualMode" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Agregar Servicio Manual <v-spacer></v-spacer>
          <v-btn
            icon
            color="red"
            @click="
              $store.state.modalServices_manualMode =
                !$store.state.modalServices_manualMode
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="formNewService">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    :items="$store.state.itemsBegEndList"
                    item-text="name"
                    item-value="id"
                    label="Ubicación/Tramo"
                    v-model="house_service_id_begend"
                    :rules="[(v) => !!v || 'Dato Requerido']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="house_service_name"
                    label="Nombre Servicio"
                    :rules="[(v) => !!v || 'Dato Requerido']"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" rounded dark @click="cancelNewService"
            >CANCELAR
          </v-btn>
          <v-btn
            color="success"
            class="ml-2"
            rounded
            dark
            @click="setNewService"
            >ACEPTAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "dataGen",
  data() {
    return {
      searchHouseCotizacion: "",
      house_service_id_begend: "",
      house_service_name: "",
      id_transport: null,
    };
  },
  async mounted() {
    this.$store.state.spiner = true;

    // await this._getModality();
    // await this._getShipment();
    // await this._getIncoterms();
    // await this._getnroMaster();
    // await this._getAgents();
    // await this._getConsigners();
    // await this._getNotify();
    // await this._getColoaders();
    // await this._getAirlines();
    // await this._getNavieras();
    // await this._getMotonave();
    // await this._getContainers();
    // await this._getFleteCon();
    // await this._getCoinsList();
    // this.$store.state.house_id_coins = this.$store.state.itemsCoinsList.filter(
    //   (v) => v.symbol === "USD"
    // )[0].id;
    // await this._validaData();
    // await this._getProveedor();
    // await this._getHouseContainers();
    this.$store.state.spiner = false;

    await this._getBegEndList();
    //this._getnroMaster();
    // this._validaData();
    //this.$store.state.drawer = false;
    this.$store.state.spiner = false;

    // await this.getQuoteNoAsignadoHouse();
    this.$forceUpdate();
  },
  computed: {
    ...mapState([
      "itemsModality",
      "itemsShipment",
      "itemsPortBegin",
      "itemsPortEnd",
      "itemsIncoterms",
      "itemsServicesBegin",
      "itemsBitacoraList",
      "drawer",
    ]),
  },
  methods: {
    ...mapActions([
      "_getModality",
      "_getShipment",
      "_getPortBegin",
      "_getPortEnd",
      "_getIncoterms",
      "_getServicesBegin",
      "_getBitacoraList",
      "_getBitacoraLineal",
      "_getnroMaster",
      "getQuoteDataNoAsignadaHouse",
      "_getnroMaster",
      "_getAgents",
      "_getConsigners",
      "_getNotify",
      "_getColoaders",
      "_getAirlines",
      "_getNavieras",
      "_getMotonave",
      "_getContainers",
      "_getFleteCon",
      "_getCoinsList",
      "_getHouseContainers",
      "_getProveedor",
      "_getHouseContainers",
      "getQuoteNoAsignadoHouse",
      "_getBegEndList",
    ]),
    async asignarDatos() {
      if (this.$store.state.house_cotizacion) {
        let id_shipment = 0;
        this.$store.state.spiner = true;

        await this.getQuoteDataNoAsignadaHouse({
          id_quote: this.$store.state.house_cotizacion,
        });

        if (
          Object.keys(this.$store.state.pricing.dataQuote).length &&
          this.$store.state.pricing.dataQuote.id_modality ==
            this.$store.state.copy_house.id_modality &&
          this.$store.state.pricing.dataQuote.id_shipment ==
            this.$store.state.copy_house.id_shipment &&
          this.$store.state.pricing.dataQuote.id_port_begin ==
            this.$store.state.copy_house.id_port_begin &&
          this.$store.state.pricing.dataQuote.id_port_end ==
            this.$store.state.copy_house.id_port_end
        ) {
          this.$store.state.house_sentido =
            this.$store.state.pricing.dataQuote.id_modality;
          this.$store.state.house_id_trasnport =
            this.$store.state.pricing.dataQuote.id_shipment;
          this.$store.state.house_id_consigner =
            this.$store.state.pricing.dataQuote.id_cliente;
          this.$store.state.house_incoterms =
            this.$store.state.pricing.dataQuote.id_incoterms;

          if (typeof this.$store.state.house_id_trasnport === "object") {
            id_shipment = this.$store.state.house_id_trasnport.id_transport;
          } else if (typeof this.$store.state.house_id_trasnport === "number") {
            id_shipment = this.$store.state.itemsShipment.filter(
              (v) => v.id == this.$store.state.pricing.dataQuote.id_shipment
            )[0].id_transport;
          }

          this.$store.state.house_bultos =
            this.$store.state.pricing.dataQuote.nro_bultos;
          this.$store.state.house_peso =
            this.$store.state.pricing.dataQuote.peso;
          this.$store.state.house_volumen =
            this.$store.state.pricing.dataQuote.volumen;
          this.$store.state.house_monto =
            this.$store.state.pricing.dataQuote.monto;
          await this._activePort(id_shipment);
          this.$store.state.house_origen =
            this.$store.state.pricing.dataQuote.id_port_begin;
          this.$store.state.house_destino =
            this.$store.state.pricing.dataQuote.id_port_end;

          // Ubicación/Tramo (categoría del servicio: Origen, Flete, Destino, Opcional)
          let lstSortedServices = [];
          let lstServicesOrigen = [];
          let lstServicesFlete = [];
          let lstServicesDestino = [];
          let lstServicesOpcional = [];

          this.$store.state.pricing.dataQuote.lstservices.filter((item, i) => {
            const categoriaServicio = item.codebegend.toUpperCase();
            switch (categoriaServicio) {
              case "OR":
                lstServicesOrigen.push(item);
                break;
              case "FL":
                lstServicesFlete.push(item);
                break;
              case "DE":
                lstServicesDestino.push(item);
                break;
              case "OP":
                lstServicesOpcional.push(item);
                break;
            }
          });

          lstSortedServices = [].concat(
            lstServicesOrigen,
            lstServicesFlete,
            lstServicesDestino,
            lstServicesOpcional
          );

          let lstServices = [];
          let itemImpuestos = null;
          lstSortedServices.map((item, i) => {
            const dataService = {
              ...item,
              status: 0,
            };

            if (item.nameservice.toUpperCase() == "IMPUESTOS") {
              itemImpuestos = dataService;
            } else {
              lstServices.push(dataService);
            }
          });

          if (itemImpuestos !== null) {
            lstServices.push(itemImpuestos);
          }

          this.$store.state.itemsHouseServices = lstServices;
        } else {
          this.$swal({
            icon: "error",
            html: "<b>El quote que está intentando agregar no tiene el mismo Sentido, Tipo de Embarque, Origen, Destino que el expediente máster. Verifique</b>",
            showConfirmButton: true,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#4CAF50",
            allowOutsideClick: false,
          });

          this.$store.state.house_cotizacion = "";
          this.searchHouseCotizacion = "";
        }

        this.$store.state.spiner = false;
      }
    },
    async _validaData() {
      var vm = this;

      if (vm.$route.params.id) {
        var data = {
          id: vm.$route.params.id,
          id_branch: JSON.parse(sessionStorage.getItem("dataUser"))[0]
            .id_branch,
        };
        var config = {
          method: "get",
          url: process.env.VUE_APP_URL_MAIN + "house_ver",
          headers: {
            "auth-token": sessionStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
          params: data,
        };
        await axios(config)
          .then(async function (response) {
            // console.log(response)

            sessionStorage.setItem("auth-token", response.data.token);

            vm.$store.state.copy_house = response.data.data[0];
            vm.$store.state.dataHouse_transporte =
              response.data.data[0].id_transport;
            vm.$store.state.house_origen = response.data.data[0].id_port_begin;
            vm.$store.state.house_destino = response.data.data[0].id_port_end;
            vm.$store.state.house_sentido = response.data.data[0].id_modality;
            vm.$store.state.house_id_trasnport =
              response.data.data[0].id_shipment;
            vm.$store.state.house_incoterms =
              response.data.data[0].id_incoterms;
            vm.$store.state.house_cotizacion = response.data.data[0].id_cot;
            await vm._getPortBegin({
              id_transport: response.data.data[0].id_transport,
              id: response.data.data[0].id_port_begin,
            });
            await vm._getPortEnd({
              id_transport: response.data.data[0].id_transport,
              id: response.data.data[0].id_port_end,
            });
            vm.$store.state.house_origen = response.data.data[0].id_port_begin;
            vm.$store.state.house_destino = response.data.data[0].id_port_end;
            vm.$store.state.house_expediente = response.data.data[0].code_house;
            vm.$store.state.house_master_expediente =
              response.data.data[0].code_master;
            vm.$store.state.house_id_agente =
              response.data.data[0].id_proveedor;
            vm.$store.state.house_id_consigner =
              response.data.data[0].id_consigner;
            vm.$store.state.house_id_notify = response.data.data[0].id_notify;
            vm.$store.state.house_id_airlines =
              response.data.data[0].id_aerolinea;
            vm.$store.state.house_id_coloader =
              response.data.data[0].id_coloader;
            //vm.$store.state.house_id_agente = response.data.data[0].id_agent;
            vm.$store.state.house_id_naviera = response.data.data[0].id_naviera;
            vm.$store.state.house_blmaster = response.data.data[0].nro_hbl;
            vm.$store.state.house_id_motonave =
              response.data.data[0].id_motonave;
            vm.$store.state.house_viaje = response.data.data[0].nro_viaje;
            vm.$store.state.house_bultos = response.data.data[0].bultos;
            vm.$store.state.house_peso = response.data.data[0].peso;
            vm.$store.state.house_volumen = response.data.data[0].volumen;
            vm.$store.state.house_id_condicion =
              response.data.data[0].id_conditions;
            vm.$store.state.house_id_coins = response.data.data[0].id_moneda;
            vm.$store.state.house_monto = response.data.data[0].monto;
            vm.$store.state.house_id = response.data.data[0].id;
            vm.$store.state.house_id_consigner_real =
              response.data.data[0].id_consigner_real;
            await vm._getServicesBegin();
            // await vm._getBitacoraLineal();
            vm.$store.state.house_enlace_tracking = response.data.data[0]
              .token_rastreo
              ? "https://aco.agentedecargaonline.com/tracking/" +
                response.data.data[0].token_rastreo
              : "";
          })
          .catch(function (error) {
            console.log(error);
          });
        // vm.$store.state.spiner = false;
      }
    },
    async _activePort(id_transport) {
      this.id_transport = id_transport;
      await this._getPortBegin({ id_transport: id_transport });
      await this._getPortEnd({ id_transport: id_transport });
      if (this.$store.state.master_id_trasnport.id == 1) {
        this.$store.state.embar_title_nacn = "Aerolinea";
      } else if (this.$store.state.master_id_trasnport.id == 2) {
        this.$store.state.embar_title_nacn = "Naviera";
      } else if (this.$store.state.master_id_trasnport.id == 3) {
        this.$store.state.embar_title_nacn = "Coloader";
      } else {
        this.$store.state.embar_title_nacn = "Aerolinea/Coloader/Naviera";
      }
    },
    _getDataService() {
      this._getServicesBegin();
      // this._getBitacoraList();
      // this._getBitacoraLineal();
    },
    setNewService() {
      var vm = this;
      if (vm.$refs.formNewService.validate()) {
        const dataBegend =
          vm.$store.state.itemsBegEndList.find(
            (v) => v.id === vm.house_service_id_begend
          ) || {};
        const dataService = {
          id_begend: vm.house_service_id_begend,
          namebegend: dataBegend.name,
          position_begend: dataBegend.position_begend,
          nameservice: vm.house_service_name,
          status: 0,
        };

        let value_itemImpuestos = null;
        let index_itemImpuestos = vm.$store.state.itemsHouseServices.findIndex(
          (item) => item.nameservice.toUpperCase() == "IMPUESTOS"
        );
        if (index_itemImpuestos !== -1) {
          value_itemImpuestos =
            vm.$store.state.itemsHouseServices[index_itemImpuestos];
          vm.$store.state.itemsHouseServices.splice(index_itemImpuestos, 1);
        }

        vm.$store.state.itemsHouseServices.push(dataService);

        if (value_itemImpuestos !== null) {
          vm.$store.state.itemsHouseServices.push(value_itemImpuestos);
        }

        vm.$store.state.modalServices_manualMode = false;
      }

      vm.$refs.formNewService.reset();
    },
    cancelNewService() {
      this.$refs.formNewService.reset();
      this.$store.state.modalServices_manualMode =
        !this.$store.state.modalServices_manualMode;
    },
    async recargarPuertoOrigen(textoBuscar) {
      await this._getPortBegin({
        id_transport: this.id_transport,
        id: this.$store.state.master_origen,
        search: textoBuscar,
      });
    },
    async recargarPuertoDestino(textoBuscar) {
      await this._getPortEnd({
        id_transport: this.id_transport,
        id: this.$store.state.master_destino,
        search: textoBuscar,
      });
    },
  },
  computed: {
    ...mapState(["dataHouse_transporte"]),
  },
};
</script>
