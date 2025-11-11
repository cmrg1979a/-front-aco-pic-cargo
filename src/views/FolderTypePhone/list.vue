<template>
  <ListTypePhoneComponent />
</template>

<script>
export default {
  components: {
    ListTypePhoneComponent: () =>
      import("@/components/FolderTypePhone/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "TIPO DE TELÉFONO";
  },
};
</script>

<style></style>
