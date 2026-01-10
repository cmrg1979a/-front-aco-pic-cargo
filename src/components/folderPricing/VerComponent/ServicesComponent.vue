<template>
  <v-card elevation="0">
    <v-card-title primary-title> SERVICIOS A REALIZAR: </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">ORIGEN</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'OR'
            )"
            :key="service.id"
            v-model="service.status"
            readonly
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox>
        </v-col>
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">FLETE</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'FL'
            )"
            :key="service.id"
            v-model="service.status"
            readonly
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">DESTINO</h4>
          <v-checkbox
            dense
            v-for="service in $store.state.pricing.listServices.filter(
              (v) => v.codebegend == 'DE'
            )"
            :key="service.id"
            v-model="service.status"
            readonly
          >
            <template v-slot:label>
              {{ service.namegroupservice }}
            </template>
          </v-checkbox></v-col
        >
        <v-col cols="12" lg="3" xl="3">
          <h4 class="mb-2">OPCIONAL</h4>
          <v-checkbox
            dense
            v-for="service in serviciosOpcionalesUnicos"
            :key="service.id"
            v-model="service.status"
            readonly
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
            readonly
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
            v-model="
              $store.state.pricing.datosPrincipales.descripcioncarga
            "
            label="Descripción de carga"
            placeholder="Descripción de carga"
            autocomplete="off"
            dense
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["getItemsServices"]),
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
