<template>
  <ListGastoComponent />
</template>

<script>
export default {
  components: {
    ListGastoComponent: () =>
      import("@/components/FolderGasto/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Tipos de Gastos";
  },
};
</script>

<style></style>
