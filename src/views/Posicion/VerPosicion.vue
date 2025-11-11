<template>
  <v-container>
    <Posicion  />
  </v-container>
</template>

<script>
export default {
  components: {
    Posicion: () => import("../../components/Posicion/VerPosicionComponet.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `ROLES DE USUARIOS DEL SISTEMA – Modo Vista`;
  },
};
</script>

<style></style>
