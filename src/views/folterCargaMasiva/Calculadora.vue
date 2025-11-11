<template>
  <CalculadoraComponent />
</template>

<script>
export default {
  components: {
    CalculadoraComponent: () =>
      import("../../components/folterCargaMasiva/CalculadoraComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "CARGA MASIVA CALCULADORA";
  },
};
</script>

<style></style>
