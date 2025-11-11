<template>
  <flujoOperacionPorMesComponent />
</template>

<script>
export default {
  components: {
    flujoOperacionPorMesComponent: () =>
      import("../../components/balances/flujoOperacionPorMesComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "FLUJO PROYECCIÓN MES";
  },
};
</script>

<style></style>
