<template>
  <div>
    <listControlGastosCom></listControlGastosCom>
  </div>
</template>
<script>
import listControlGastosCom from "@/components/folderBilling/listControlGastos.vue";
export default {
  name: "listEntities",
  components: {
    listControlGastosCom,
  },
  mounted() {
    this.$store.state.mainTitle = "LISTA DE CONTROL DE GASTOS";
  },
  data() {
    return {};
  },
};
</script>
