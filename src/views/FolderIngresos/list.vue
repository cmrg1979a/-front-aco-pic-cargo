<template>
  <ListIngresosComponent />
</template>

<script>
export default {
  components: {
    ListIngresosComponent: () =>
      import("@/components/FolderIngresos/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Tipos de Ingresos";
  },
};
</script>

<style></style>
