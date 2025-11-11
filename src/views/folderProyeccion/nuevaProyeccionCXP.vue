<template>
  <v-card>
    <nuevaProyeccion />
  </v-card>
</template>

<script>
export default {
  components: {
    nuevaProyeccion: () =>
      import("../../components/proyeccion/nuevaProyeccionCXP.vue"),
  },
  mounted() {
    this.$store.state.mainTitle =
      "REGISTRO DE NUEVA PROYECCIÓN GASTOS";
  },
};
</script>

<style></style>
