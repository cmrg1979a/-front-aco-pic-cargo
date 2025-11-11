<template>
  <ListModalityComponent />
</template>

<script>
export default {
  components: {
    ListModalityComponent: () =>
      import("@/components/FolderModality/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "MODALIDADES (SENTIDOS)";
  },
};
</script>

<style></style>
