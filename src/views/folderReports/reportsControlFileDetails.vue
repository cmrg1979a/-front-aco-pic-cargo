<template>
  <div>
    <listMasterComD statusReport="true"></listMasterComD>
  </div>
</template>
<script>
import listMasterComD from "@/components/Reports/reportFileDetails.vue";
export default {
  name: "listEntities",
  components: {
    listMasterComD,
  },
  mounted() {
    this.$store.state.mainTitle = "REPORTE CONTROL DE FILE DETALLADO";
  },
  data() {
    return {};
  },
};
</script>
