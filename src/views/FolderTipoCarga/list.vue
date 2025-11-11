<template>
  <ListShipmentComponent />
</template>

<script>
export default {
  components: {
    ListShipmentComponent: () =>
      import("@/components/FolderTipoCarga/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Tipos de Carga";
  },
};
</script>

<style></style>
