<template>
  <ListYearComponent />
</template>

<script>
export default {
  components: {
    ListYearComponent: () =>
      import("@/components/FolderYear/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Años";
  },
};
</script>

<style></style>
