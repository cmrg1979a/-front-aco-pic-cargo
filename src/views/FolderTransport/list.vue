<template>
  <ListTransportComponent />
</template>

<script>
export default {
  components: {
    ListTransportComponent: () =>
      import("@/components/FolderTransport/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "TIPOS DE TRANSPORTE";
  },
};
</script>

<style></style>
