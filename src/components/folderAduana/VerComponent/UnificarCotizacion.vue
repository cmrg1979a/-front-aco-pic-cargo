<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="py-2">
        Unificar Cotización asociada a:
        {{ $store.state.aduana.datosPrincipales.nombre }}
      </v-col>
      <v-col cols="2" class="py-0">
        <v-select
          dense
          outlined
          label="Cotización"
          :items="$store.state.aduana.listQuotes"
          v-model="id_quote"
          item-text="quote"
          item-value="id"
          clearable
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-2">
        <v-btn color="success" @click="unificar()" :disabled="unificarflag"
          >Unificar</v-btn
        >
      </v-col>
      <v-col v-if="unificarflag" cols="6">
        <v-alert dense outlined type="error">
          Recuerde que solo se puede unificar, cotizaciones que solo tengan una
          opción activa.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      id_quote: "",
    };
  },
  methods: {
    ...mapActions(["unificarQuoteAduana"]),
    async unificar() {
      let data = {
        id_quote: this.id_quote,
        id_aduana: this.$route.params.id,
      };
      await this.unificarQuoteAduana(data);
      if (this.$store.state.aduana.nro_quote) {
        Swal.fire({
          icon: "success",
          title: "Aviso",
          text: this.$store.state.aduana.mensaje,
          confirmButtonText: "Ir a la cotización",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({
              name: "verQuote",
              params: {
                id: this.$store.state.aduana.IdQuote,
              },
            });
          }
          if (result.isDismissed) {
            this.$router.push({
              name: "lstQuote",
            });
          }
        });
        this.$store.state.spiner = false;
        let vm = this;
      }
    },
  },
  computed: {
    unificarflag() {
      if (
        this.$store.state.aduana.opcionCostos.filter((v) => v.selected)
          .length == 1
      ) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
