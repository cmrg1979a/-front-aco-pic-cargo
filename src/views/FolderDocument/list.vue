<template>
  <ListDocumentsComponent />
</template>

<script>
export default {
  components: {
    ListDocumentsComponent: () =>
      import("@/components/FolderDocument/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "TIPO DE DOCUMENTOS";
  },
};
</script>

<style></style>
