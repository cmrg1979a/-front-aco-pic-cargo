<template>
  <ListBankComponent />
</template>

<script>
export default {
  components: {
    ListBankComponent: () =>
      import("@/components/folderBanks/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Banco";
  },
};
</script>

<style></style>
