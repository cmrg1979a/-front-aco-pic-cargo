<template>
    <v-card>
      <nuevaProyeccion />
    </v-card>
  </template>
  
  <script>
  export default {
    components: {
      nuevaProyeccion: () =>
        import("../../components/proyeccion/verProyeccion.vue"),
    },
    mounted() {
      this.$store.state.mainTitle =
        "VER PROYECCIÓN DE GASTOS";
    },
  };
  </script>
  
  <style></style>
  