<template>
  <v-card class="pa-3">
    <listProyeccionCXP />
  </v-card>
</template>

<script>
export default {
  components: {
    listProyeccionCXP: () =>
      import("../../components/proyeccion/proyeccionCxP.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "PROYECCIÓN DE GASTOS";
  },
};
</script>

<style></style>
