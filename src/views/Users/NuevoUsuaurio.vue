<template>
  <v-container fluid>
    <Users />
  </v-container>
</template>

<script>
export default {
  components: {
    Users: () => import("@/components/Users/NuevoUserComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `NUEVO USUARIO`;
  },
};
</script>

<style></style>
