<template>
  <div class="">
    <listPayForCliente />
  </div>
</template>

<script>
import listPayForCliente from "@/components/folderBanks/listPayForCliente";

export default {
  components: {
    listPayForCliente,
  },
  mounted() {
    this.$store.state.mainTitle = "LISTADO DE INGRESOS";
  },
};
</script>

<style></style>
