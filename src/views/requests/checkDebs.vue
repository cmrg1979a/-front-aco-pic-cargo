<template>
  <div>
    <checkDebs />
  </div>
</template>
<script>
import checkDebs from "../../components/folderRequests/checkDebs.vue";

export default {
  name: "controlRequest",
  components: {
    checkDebs,
  },
  mounted() {
    this.$store.state.mainTitle = "Abonos para confirmar";
  },

  
};
</script>
