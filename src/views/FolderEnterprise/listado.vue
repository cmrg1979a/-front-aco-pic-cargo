<template>
  <ListEnterpriseComponent />
</template>

<script>
export default {
  components: {
    ListEnterpriseComponent: () =>
      import("@/components/FolderEnterprise/listado.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "EMPRESAS";
  },
};
</script>

<style></style>
