<template>
    <v-container fluid>
      <Posicion />
    
    </v-container>
  </template>
  
  <script>
  export default {
    components: {
      Posicion: () => import("../../components/Posicion/EditarPosicionComponet.vue"),
      FilterPosicion: () => import("../../components/filtros/FilterPosicion.vue"),
    },
    mounted() {
      this.$store.state.mainTitle = `ROLES DE USUARIOS DEL SISTEMA POSICIÓN`;
    },
  };
  </script>
  
  <style></style>