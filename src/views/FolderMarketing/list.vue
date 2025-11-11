<template>
  <ListMarketingComponent />
</template>

<script>
export default {
  components: {
    ListMarketingComponent: () =>
      import("@/components/FolderMarketing/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "TIPO DE MARKETING";
  },
};
</script>

<style></style>
