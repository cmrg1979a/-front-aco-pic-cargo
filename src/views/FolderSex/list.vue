<template>
  <ListSexComponent />
</template>

<script>
export default {
  components: {
    ListSexComponent: () =>
      import("@/components/FolderSex/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Géneros";
  },
};
</script>

<style></style>
