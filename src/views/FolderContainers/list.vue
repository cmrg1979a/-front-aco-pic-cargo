<template>
  <ListContainersComponent />
</template>

<script>
export default {
  components: {
    ListContainersComponent: () =>
      import("@/components/FolderContainers/list.vue"),
  },
  mounted() {
    this.$store.state.mainTitle = "Tipos de Contenedores";
  },
};
</script>

<style></style>
