<template>
  <ListPerformanceComponent />
</template>

<script>
export default {
  components: {
    ListPerformanceComponent: () =>
      import("@/components/FolderPerformance/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Tipos de Documentos Comerciales";
  },
};
</script>

<style></style>
