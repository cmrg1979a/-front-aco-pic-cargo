<template>
  <ListGroupservicesComponent />
</template>

<script>
export default {
  components: {
    ListGroupservicesComponent: () =>
      import("@/components/FolderGroupServices/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Servicios";
  },
};
</script>

<style></style>
