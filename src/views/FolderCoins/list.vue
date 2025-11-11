<template>
  <ListCoinsComponent />
</template>

<script>
export default {
  components: {
    ListCoinsComponent: () =>
      import("@/components/FolderCoins/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Monedas";
  },
};
</script>

<style></style>
