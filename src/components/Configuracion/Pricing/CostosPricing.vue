<template>
  <v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-form ref="frmBuscar">
            <v-row>
              <v-col cols="12" md="2">
                <v-autocomplete
                  :items="$store.state.pricing.listModality"
                  label="Modalidad"
                  outlined
                  dense
                  item-text="name"
                  item-value="id"
                  v-model="id_modality"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                />
              </v-col>
              <v-col cols="12" md="2">
                <v-autocomplete
                  :items="$store.state.pricing.listShipment"
                  label="Tipo Mercancía"
                  outlined
                  dense
                  item-text="embarque"
                  item-value="id"
                  v-model="id_shipment"
                  :rules="[(v) => !!v || 'Dato Requerido']"
                />
              </v-col>
              <!-- <v-col cols="12" md="2">
                <v-autocomplete
                  :items="$store.state.pricing.listIncoterms"
                  label="Incoterms"
                  outlined
                  dense
                  item-text="name"
                  item-value="id"
                  v-model="id_incoterms"
                />
              </v-col> -->
              <!-- <v-col cols="12" md="2">
                <v-btn
                  color="info"
                  small
                  @click="cargarDatos"
                  v-if="!editarflag"
                >
                  <v-icon small>mdi-magnify</v-icon> Cargar Datos</v-btn
                >
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="success" small v-if="editarflag">
                  <v-icon small>mdi-content-save-all</v-icon> Guardar
                </v-btn>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn color="error" small @click="limpiar" v-if="editarflag">
                  <v-icon small>mdi-cancel</v-icon> Cancelar</v-btn
                >
              </v-col> -->
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headersIcoterms"
            :items="$store.state.incoterm.list"
          >
            <template v-slot:[`item.action`]="{ item }">
              <v-btn color="#E65100" @click="abrirModal(item.id)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" scrollable fullscreen persistent>
      <v-card>
        <v-card-title style="background: #b3e5fc">
          {{ modality.name }} | {{ shipment.embarque }}
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="lstCostos"
            :loading="lstCostos.length == 0"
            dense
            disable-pagination
          >
            <template v-slot:[`item.multiplicador`]="{ item }">
              <v-autocomplete
                :items="lstMultiplicador"
                item-value="id"
                item-text="name"
                v-model="item.id_multiplicador"
                outlined
                dense
                hide-details
              ></v-autocomplete>
            </template>
            <template v-slot:[`item.costo`]="{ item }">
              <v-text-field
                dense
                v-model="item.costo"
                outlined
                hide-details
              ></v-text-field>
            </template>
            <template v-slot:[`item.precio`]="{ item }">
              <v-text-field
                dense
                v-model="item.precio"
                type="number"
                step="0.01"
                outlined
                hide-details
              ></v-text-field>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-switch
                v-model="item.status"
                :true-value="1"
                :false-value="0"
              ></v-switch>
            </template>
            <template v-slot:[`item.proveedor`]="{ item }">
              <v-autocomplete
                dense
                item-text="namelong"
                item-value="id"
                :items="$store.state.proveedor.lstProveedores"
                @update:search-input="recargarProveedores"
                v-model="item.id_proveedor"
                hide-details
                outlined
              ></v-autocomplete>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="align-self-end">
          <v-btn color="success" @click="guardar">Actualizar</v-btn>
          <v-btn color="error" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  data() {
    return {
      modality: {},
      shipment: {},
      dialog: false,
      editarflag: false,
      headersIcoterms: [
        { value: "name", text: "Incoterms", width: "40%" },
        { value: "updated_config", text: "Ult. Fecha Modif", width: "40%" },
        { value: "action", text: "", width: "20%" },
      ],
      headers: [
        // { value: "incoterms", text: "Inc.", width: "5%" },
        // { key: "id_proveedor", text: "id_proveedor" },
        { value: "proveedor", text: "Proveedor", width: "25%" },
        // { key: "id_costo", text: "id_costo" },
        // { value: "id_multiplicador", text: "id_multiplicador" },
        { value: "multiplicador", text: "Multiplicador", width: "25%" },
        { value: "costo", text: "Costo", width: "30%" },
        { value: "precio", text: "Precio", width: "10%" },
        { value: "status", text: "Status", width: "5%" },
      ],
      id_modality: "",
      id_shipment: "",
      id_incoterms: "",
    };
  },
  async mounted() {
    await Promise.all([
      this.getModality(),
      this.getShipment(),
      this.CargarIncotermsConfig(),
    ]);
  },
  methods: {
    ...mapActions([
      "getModality",
      "getShipment",
      "CargarIncotermsConfig",
      "obtenerProveedorPricing",
    ]),
    ...mapActions("configuracion", [
      "getCargarCostos",
      "getMultiplicador",
      "setGuardarCostos",
    ]),
    async cargarDatos() {
      this.$store.state.configuracion.lstCostos = [];

      let data = {
        id_modality: this.id_modality,
        id_shipment: this.id_shipment,
        id_incoterms: this.id_incoterms,
      };
      await Promise.all([
        this.getCargarCostos(data),
        this.getMultiplicador(this.id_shipment),
      ]);

      let IdProveedor = this.lstCostos.map((v) => {
        return v.id_proveedor;
      });

      await this.obtenerProveedorPricing({
        id: IdProveedor.join(","),
        search: null,
      });
    },
    abrirModal(id) {
      if (!this.$refs.frmBuscar.validate()) {
        return;
      }
      this.id_incoterms = id;
      this.modality = this.$store.state.pricing.listModality.find(
        (v) => (v.id = this.id_modality),
      );
      this.shipment = this.$store.state.pricing.listShipment.find(
        (v) => (v.id = this.id_shipment),
      );
      this.cargarDatos();
      this.dialog = true;
    },
    recargarProveedores: _.debounce(async function (e) {
      if (!e) return; // No buscar si el input está vacío

      let IdProveedor = this.lstCostos.map((v) => v.id_proveedor);
      await this.obtenerProveedorPricing({
        id: IdProveedor.join(","),
        search: e,
      });
    }, 100),
    limpiar() {
      this.$refs.frmBuscar.reset();
      this.$store.state.configuracion.lstCostos = [];
      this.editarflag = false;
    },
    async guardar() {
      await this.setGuardarCostos({
        lstCostos: this.lstCostos,
        id_incoterms: this.id_incoterms,
      });
      this.CargarIncotermsConfig();
      this.dialog = false;
    },
  },
  computed: {
    ...mapState("configuracion", ["lstCostos", "lstMultiplicador"]),
  },
};
</script>

<style></style>
