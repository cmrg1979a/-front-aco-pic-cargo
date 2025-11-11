<template>
  <div>
    <listMasterCom statusReport="true"></listMasterCom>
  </div>
</template>
<script>
import listMasterCom from "@/components/Reports/reportFile.vue";
export default {
  name: "listEntities",
  components: {
    listMasterCom,
  },
  mounted() {
    this.$store.state.mainTitle = "REPORTE CONTROL DE FILE";
  },
  data() {
    return {};
  },
};
</script>
