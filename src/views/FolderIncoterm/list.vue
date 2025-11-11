<template>
  <ListIncotermComponent />
</template>

<script>
export default {
  components: {
    ListIncotermComponent: () =>
      import("@/components/FolderIncoterm/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Incoterm";
  },
};
</script>

<style></style>
