<template>
  <v-card>
    <ControlGastos />
  </v-card>
</template>

<script>
export default {
  components: {
    ControlGastos: () =>
      import("@/components/folterCargaMasiva/ControlGastosComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "CARGA MASIVA CONTROL DE GASTOS";
  },
};
</script>

<style></style>
