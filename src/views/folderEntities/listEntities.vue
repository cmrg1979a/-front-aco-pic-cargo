<template>
  <div>
    <listEntitiesCom></listEntitiesCom>
  </div>
</template>
<script>
import listEntitiesCom from "@/components/folderEntities/listEntities.vue";
export default {
  name: "listEntities",
  components: {
    listEntitiesCom,
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.state.mainTitle = `LISTA DE ${this.$store.state.menuName.toUpperCase()}`;
  },
};
</script>
