<template>
  <listPayForProveedor />
</template>

<script>
import listPayForProveedor from "@/components/folderBanks/listPayForProveedor";

export default {
  components: {
    listPayForProveedor,
  },
  mounted() {
    this.$store.state.mainTitle = "LISTADO DE SALIDAS";
  },
};
</script>

<style></style>
