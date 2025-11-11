<template>
  <v-container fluid>
    <Users />
  </v-container>
</template>

<script>
export default {
  components: {
    Users: () => import("@/components/Users/VerUserComponent.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = `VER USUARIO`;
  },
};
</script>

<style></style>
