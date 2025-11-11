<template>
  <ListMultiplicadorComponent />
</template>

<script>
export default {
  components: {
    ListMultiplicadorComponent: () =>
      import("@/components/FolderMultiplicador/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Multiplicadores";
  },
};
</script>

<style></style>
