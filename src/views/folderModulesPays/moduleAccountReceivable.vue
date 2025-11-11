<template>
  <div>
    <moduleAccountReceivableCom />
  </div>
</template>
<script>
import moduleAccountReceivableCom from "@/components/folderModulesPays/moduleAccountReceivable.vue";
export default {
  components: {
    moduleAccountReceivableCom,
  },
  name: "moduleAccountReceivableNew",
  mounted() {
    this.$store.state.mainTitle = "CONTROL DE CUENTAS POR COBRAR";
  },
};
</script>
