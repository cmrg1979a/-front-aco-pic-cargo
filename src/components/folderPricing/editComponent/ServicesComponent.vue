<template>
  <v-card elevation="0">
    <v-dialog v-model="dialog" v-if="dialog" max-width="30%">
      <v-card>
        <v-card-title primary-title> Nuevo Servicio </v-card-title>
        <v-card-text>
          <v-select
            :items="$store.state.pricing.begEndList"
            v-model="servicio.id_begend"
            item-text="name"
            item-value="id"
            label="Categoria..."
          ></v-select>
          <v-text-field
            label="Descripción"
            v-model="servicio.namegroupservice"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardarServicio()">Guardar</v-btn>
          <v-btn color="red" @click="dialog = !dialog" dark>Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-card-title primary-title> SERVICIOS A REALIZAR:</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <h4 class="mb-2">ORIGEN</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'OR'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="3">
          <h4 class="mb-2">FLETE</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'FL'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="3">
          <h4 class="mb-2">DESTINO</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'DE'
            )"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="3">
          <h4 class="mb-2">OPCIONAL</h4>
          <v-checkbox
            dense
            v-for="service in serviciosOpcionalesUnicos"
            :key="service.id"
            v-model="service.status"
            @change="showConfirmationDialog(service)"
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox>
          <v-text-field
            prefix="$"
            :color="requiereValorMercancia ? 'red' : ''"
            :error-messages="$store.state.pricing.errorValorMercancia"
            v-model="$store.state.pricing.datosPrincipales.amount"
            label="Valor de la mercancia"
            type="number"
            step="0.10"
            min="0"
            placeholder="Valor de la mercancia..."
            autocomplete="off"
            dense
            :required="requiereValorMercancia"
            :rules="[
              (v) => !requiereValorMercancia || (!!v && Number(v) > 0) || 'Dato Requerido',
              (v) =>
                !v || /^(?!0\d+|\d*e)\d*(?:\.\d+)?$/.test(v) ||
                'Debe ser un número real entero positivo',
            ]"
            @input="recargarCostos()"
            @blur="recargarCostos()"
          >
          </v-text-field>
          <v-text-field
            v-if="
              (this.$store.state.pricing.listServices.filter(
                (v) => v.codegroupservices == 15
              ).length > 0
                ? this.$store.state.pricing.listServices.filter(
                    (v) => v.codegroupservices == 15
                  )[0].status
                : false) ||
              (this.$store.state.pricing.listServices.filter(
                (v) => v.codegroupservices == 2
              ).length > 0
                ? this.$store.state.pricing.listServices.filter(
                    (v) => v.codegroupservices == 2
                  )[0].status
                : false) ||
              (this.$store.state.pricing.listServices.filter(
                (v) => v.codegroupservices == 6
              ).length > 0
                ? this.$store.state.pricing.listServices.filter(
                    (v) => v.codegroupservices == 6
                  )[0].status
                : false)
            "
            v-model="$store.state.pricing.datosPrincipales.descripcioncarga"
            label="Descripción de carga"
            placeholder="Descripción de carga"
            autocomplete="off"
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,

      servicio: {
        codebegend: "OP",
        id_begend: "0",
        namegroupservice: "",
        status: true,
      },
    };
  },
  mounted() {
    // console.log(this.$store.state.pricing.copylistCostos);
  },
  methods: {
    ...mapActions([
      "getItemsServices",
      "getImpuestos",
      "getItemsServicesDetails",
      "getTipoCostos",
    ]),
    recargarCostos() {
      this.$store.state.pricing.errorValorMercancia = "";
      this.$store.state.pricing.actualizarCostosFlag =
        !this.$store.state.pricing.actualizarCostosFlag;
    },
    guardarServicio() {
      let codebegend = this.$store.state.pricing.begEndList.filter(
        (v) => v.id == this.servicio.id_begend
      )[0].code;
      this.servicio.codebegend = codebegend;
      this.$store.state.pricing.listServices.push(this.servicio);
      this.dialog = false;
    },
    esImportacion() {
      return this.$store.state.pricing.listModality.some(
        (v) =>
          v.id == this.$store.state.pricing.datosPrincipales.idsentido &&
          v.code == "I"
      );
    },
    showConfirmationDialog(service) {
      let copyCost = [...this.$store.state.pricing.listCostos];

      Swal.fire({
        width: 800,
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
      }).then(async (res) => {
        if (res.isConfirmed) {
          this.$store.state.spiner = true;
          this.$store.state.pricing.listImpuestos = [];
          this.$store.state.pricing.listCostos = [];
          await this.getImpuestos();
          await this.getTipoCostos();
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
          this.$store.state.pricing.actualizarCostosFlag =
            !this.$store.state.pricing.actualizarCostosFlag;
          this.$store.state.spiner = false;
        }
        if (res.isDismissed) {
          service.status = !service.status;
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
    requiereValorMercancia() {
      const services = this.$store.state.pricing.listServices || [];
      const normalize = (str) =>
        String(str || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      const keywords = ["seguro", "impuesto", "impuestos", "aduana en destino"];
      return services.some((s) => {
        if (!s) return false;
        const checked = s.status === true || s.status === 1;
        if (!checked) return false;
        const name = normalize(s.service || s.namegroupservice);
        return keywords.some((k) => name.includes(k));
      });
    },
    serviciosOpcionalesUnicos() {
      const services = this.$store.state.pricing.listServices || [];
      const vistos = new Set();
      return services
        .filter((v) => v.codebegend == "OP")
        .filter((s) => {
          const name = (s.service || s.namegroupservice || "").trim().toLowerCase();
          if (!name) return true;
          if (vistos.has(name)) return false;
          vistos.add(name);
          return true;
        });
    },
  },
};
</script>

<style></style>
