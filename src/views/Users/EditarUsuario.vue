<template>
  <v-container fluid>
    <Users />
  </v-container>
</template>

<script>
export default {
  components: {
    Users: () => import("@/components/Users/EditUserComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `EDITAR USUARIO`;
  },
};
</script>

<style></style>
